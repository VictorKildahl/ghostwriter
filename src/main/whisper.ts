import { app } from "electron";
import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import {
  getWhisperLanguageCode,
  type TranscriptionLanguage,
} from "../../types/languages";

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const MODEL_FILENAME = "ggml-large-v3-turbo.bin";
const SERVER_PORT = 8178;
const SERVER_HOST = "127.0.0.1";
const HEALTH_POLL_MS = 200;
const HEALTH_TIMEOUT_MS = 30_000;

/* ------------------------------------------------------------------ */
/*  Path resolution (cached)                                           */
/* ------------------------------------------------------------------ */

let resolvedServerBin: string | undefined;
let resolvedModelPath: string | undefined;
let resolvedLibDir: string | undefined;

function resolvePaths() {
  if (resolvedServerBin) return;

  const base =
    process.env.GHOSTTYPE_RESOURCES_PATH ??
    (app.isPackaged ? process.resourcesPath : app.getAppPath());

  const candidates = [base, path.join(base, "resources")];

  for (const dir of candidates) {
    const bin = path.join(dir, "whisper", "whisper-server");
    if (!resolvedServerBin && fs.existsSync(bin)) {
      resolvedServerBin = bin;
      resolvedLibDir = path.join(dir, "whisper", "lib");
    }
    const model = path.join(dir, "whisper", "models", MODEL_FILENAME);
    if (!resolvedModelPath && fs.existsSync(model)) resolvedModelPath = model;
  }

  resolvedServerBin = process.env.WHISPER_SERVER_BIN ?? resolvedServerBin;
  resolvedModelPath = process.env.WHISPER_MODEL ?? resolvedModelPath;
}

/* ------------------------------------------------------------------ */
/*  Server lifecycle                                                   */
/* ------------------------------------------------------------------ */

let serverProc: ChildProcess | null = null;
let serverReady = false;
let startingPromise: Promise<void> | null = null;

/**
 * Start the whisper-server process and wait until it is ready to accept
 * HTTP requests.  Safe to call multiple times — reuses existing server
 * or waits for an in-flight start to complete.
 *
 * The model is loaded once into memory on startup.  Each subsequent
 * transcription call is a lightweight HTTP POST (~35 ms).
 */
export async function startWhisperServer(): Promise<void> {
  if (serverReady && serverProc && !serverProc.killed) return;
  if (startingPromise) return startingPromise;

  startingPromise = doStart();
  try {
    await startingPromise;
  } finally {
    startingPromise = null;
  }
}

async function doStart(): Promise<void> {
  resolvePaths();

  if (!resolvedServerBin) {
    throw new Error(
      "whisper-server binary not found. Expected at resources/whisper/whisper-server",
    );
  }
  if (!resolvedModelPath) {
    throw new Error(
      `Whisper model not found. Place ${MODEL_FILENAME} in resources/whisper/models/`,
    );
  }

  console.log(
    "[whisper] starting server bin=%s model=%s port=%d",
    resolvedServerBin,
    resolvedModelPath,
    SERVER_PORT,
  );

  const env = { ...process.env };
  if (resolvedLibDir && fs.existsSync(resolvedLibDir)) {
    env.DYLD_LIBRARY_PATH = [resolvedLibDir, env.DYLD_LIBRARY_PATH]
      .filter(Boolean)
      .join(":");
  }

  const proc = spawn(
    resolvedServerBin,
    [
      "-m",
      resolvedModelPath,
      "--port",
      String(SERVER_PORT),
      "--host",
      SERVER_HOST,
      "-l",
      "auto",
      "-t",
      "8", // use 8 threads (M-series performance cores)
      "-bo",
      "1", // best-of 1 — skip re-ranking, pure greedy
      "--no-timestamps", // skip timestamp computation
      "-nf", // no temperature fallback — we send temp=0
      "-sns", // suppress non-speech tokens
    ],
    { stdio: ["ignore", "pipe", "pipe"], env },
  );
  serverProc = proc;

  proc.stdout?.on("data", (chunk: Buffer) => {
    console.log("[whisper-server]", chunk.toString().trimEnd());
  });
  proc.stderr?.on("data", (chunk: Buffer) => {
    console.log("[whisper-server]", chunk.toString().trimEnd());
  });

  proc.on("error", (err) => {
    console.error("[whisper] server spawn error:", err.message);
  });

  proc.once("exit", (code, signal) => {
    console.log("[whisper] server exited code=%s signal=%s", code, signal);
    serverReady = false;
    serverProc = null;
  });

  await waitForServer();
  serverReady = true;
  console.log("[whisper] server ready on port %d", SERVER_PORT);
}

function waitForServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + HEALTH_TIMEOUT_MS;

    function poll() {
      if (!serverProc || serverProc.killed) {
        return reject(new Error("whisper-server process died during startup"));
      }
      if (Date.now() > deadline) {
        return reject(
          new Error(
            `whisper-server did not become ready within ${HEALTH_TIMEOUT_MS}ms`,
          ),
        );
      }

      const req = http.get(`http://${SERVER_HOST}:${SERVER_PORT}/`, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => setTimeout(poll, HEALTH_POLL_MS));
      req.setTimeout(1000, () => {
        req.destroy();
        setTimeout(poll, HEALTH_POLL_MS);
      });
    }

    poll();
  });
}

/** Gracefully stop the whisper-server process. */
export function stopWhisperServer(): void {
  if (!serverProc) return;
  console.log("[whisper] stopping server");
  const proc = serverProc;
  serverReady = false;
  serverProc = null;
  proc.kill("SIGTERM");
  const forceKill = setTimeout(() => {
    try {
      proc.kill("SIGKILL");
    } catch {
      /* already exited */
    }
  }, 3000);
  proc.once("exit", () => clearTimeout(forceKill));
}

/* ------------------------------------------------------------------ */
/*  Transcription via HTTP POST                                        */
/* ------------------------------------------------------------------ */

/**
 * Transcribe a WAV file by POSTing it to the running whisper-server.
 * Starts the server automatically on first call.
 */
export async function transcribeWithWhisper(
  wavPath: string,
  language: TranscriptionLanguage,
): Promise<string> {
  await startWhisperServer();

  const lang = getWhisperLanguageCode(language) ?? "auto";
  const wavData = fs.readFileSync(wavPath);

  const boundary = `----GhostType${Date.now()}`;
  const parts: Buffer[] = [];

  function addField(name: string, value: string) {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
      ),
    );
  }
  function addFile(name: string, filename: string, data: Buffer) {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename="${filename}"\r\nContent-Type: audio/wav\r\n\r\n`,
      ),
    );
    parts.push(data);
    parts.push(Buffer.from("\r\n"));
  }

  addFile("file", path.basename(wavPath), wavData);
  addField("response_format", "json");
  addField("temperature", "0.0");
  addField("language", lang);
  parts.push(Buffer.from(`--${boundary}--\r\n`));

  const body = Buffer.concat(parts);
  const t0 = Date.now();

  const result = await new Promise<string>((resolve, reject) => {
    const req = http.request(
      {
        hostname: SERVER_HOST,
        port: SERVER_PORT,
        path: "/inference",
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": body.length,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk: Buffer) => (data += chunk.toString()));
        res.on("end", () => {
          if (res.statusCode !== 200) {
            return reject(
              new Error(
                `whisper-server returned ${res.statusCode}: ${data.slice(0, 200)}`,
              ),
            );
          }
          try {
            const json = JSON.parse(data);
            resolve(json.text ?? "");
          } catch {
            resolve(data);
          }
        });
      },
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });

  console.log("[whisper] transcribed in %dms lang=%s", Date.now() - t0, lang);
  return result.replace(/\s+/g, " ").trim();
}
