#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="${ROOT}/.cache/whisper"
OUT_DIR="${ROOT}/resources/whisper"
LIB_DIR="${OUT_DIR}/lib"
MODEL_DIR="${OUT_DIR}/models"
MODEL_NAME="${WHISPER_MODEL_NAME:-large-v3-turbo}"

mkdir -p "$CACHE_DIR" "$OUT_DIR" "$LIB_DIR" "$MODEL_DIR"

# ── Model download ────────────────────────────────────────────────

download_model() {
  local model_path="${MODEL_DIR}/ggml-${MODEL_NAME}.bin"
  if [ -f "$model_path" ]; then
    echo "Model already exists: $model_path"
    return 0
  fi
  local url="${WHISPER_MODEL_URL:-https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-${MODEL_NAME}.bin}"
  echo "Downloading model from $url"
  curl -L "$url" -o "$model_path"
}

# ── Bundle whisper-server + dylibs from Homebrew ──────────────────

bundle_from_homebrew() {
  local brew_prefix
  brew_prefix="$(brew --prefix whisper-cpp 2>/dev/null || true)"

  if [ -z "$brew_prefix" ] || [ ! -d "$brew_prefix" ]; then
    echo "whisper-cpp not found via Homebrew. Installing..."
    brew install whisper-cpp
    brew_prefix="$(brew --prefix whisper-cpp)"
  fi

  echo "Using Homebrew whisper-cpp at $brew_prefix"

  # Copy server binary
  local server_bin="${brew_prefix}/bin/whisper-server"
  if [ ! -f "$server_bin" ]; then
    echo "ERROR: whisper-server binary not found at $server_bin" >&2
    return 1
  fi
  cp "$server_bin" "$OUT_DIR/whisper-server"
  chmod +x "$OUT_DIR/whisper-server"
  echo "Bundled whisper-server -> $OUT_DIR/whisper-server"

  # Copy whisper-cli as fallback
  local cli_bin="${brew_prefix}/bin/whisper-cli"
  if [ -f "$cli_bin" ]; then
    cp "$cli_bin" "$OUT_DIR/whisper-cli"
    chmod +x "$OUT_DIR/whisper-cli"
    echo "Bundled whisper-cli -> $OUT_DIR/whisper-cli"
  fi

  # Copy all required dylibs
  local libexec_lib="${brew_prefix}/libexec/lib"
  local dylibs=(
    libwhisper.1.dylib
    libggml.0.dylib
    libggml-cpu.0.dylib
    libggml-blas.0.dylib
    libggml-metal.0.dylib
    libggml-base.0.dylib
  )

  for lib in "${dylibs[@]}"; do
    local src="${libexec_lib}/${lib}"
    if [ -f "$src" ]; then
      cp "$src" "$LIB_DIR/$lib"
      chmod +x "$LIB_DIR/$lib"
    else
      echo "WARNING: $lib not found at $src" >&2
    fi
  done

  # Fix rpaths so binaries find libs relative to themselves
  install_name_tool -add_rpath @executable_path/lib "$OUT_DIR/whisper-server" 2>/dev/null || true
  install_name_tool -add_rpath @executable_path/lib "$OUT_DIR/whisper-cli" 2>/dev/null || true

  # Fix dylib rpaths so they find each other
  for lib in "$LIB_DIR"/*.dylib; do
    install_name_tool -add_rpath @loader_path "$lib" 2>/dev/null || true
  done

  # Re-sign everything (install_name_tool invalidates signatures;
  # macOS kills unsigned arm64 binaries with SIGKILL)
  codesign --force --sign - "$OUT_DIR/whisper-server"
  [ -f "$OUT_DIR/whisper-cli" ] && codesign --force --sign - "$OUT_DIR/whisper-cli"
  for lib in "$LIB_DIR"/*.dylib; do
    codesign --force --sign - "$lib"
  done

  # Clear quarantine attributes
  xattr -cr "$OUT_DIR" 2>/dev/null || true

  echo "Bundled dylibs -> $LIB_DIR/"
}

# ── Main ──────────────────────────────────────────────────────────

bundle_from_homebrew
download_model

echo ""
echo "✅ Whisper bundle complete:"
echo "   Server:  $OUT_DIR/whisper-server"
echo "   Libs:    $LIB_DIR/"
echo "   Model:   $MODEL_DIR/ggml-${MODEL_NAME}.bin"
