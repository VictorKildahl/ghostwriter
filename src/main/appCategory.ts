import { execSync } from "node:child_process";

export type AppCategory = "personal" | "work" | "email" | "other";

/**
 * Known macOS bundle IDs mapped to app categories.
 * Browsers are intentionally categorised as "other" because we can't
 * reliably determine what website is open inside them.
 */
const BUNDLE_CATEGORY: Record<string, AppCategory> = {
  // ── Personal messaging ──────────────────────────────────────────────
  "com.apple.MobileSMS": "personal", // iMessage
  "com.apple.iChat": "personal", // Messages (older macOS)
  "net.whatsapp.WhatsApp": "personal",
  "com.whatsapp.WhatsApp": "personal",
  "org.telegram.desktop": "personal",
  "ru.keepcoder.Telegram": "personal",
  "com.facebook.archon": "personal", // Messenger desktop
  "com.facebook.archon.developerID": "personal",
  "com.hnc.Discord": "personal", // Discord (personal default)
  "com.signalapps.signal-desktop": "personal",
  "jp.naver.line.mac": "personal",
  "com.viber.osx": "personal",

  // ── Work messaging ──────────────────────────────────────────────────
  "com.tinyspeck.slackmacgap": "work", // Slack
  "com.microsoft.teams": "work",
  "com.microsoft.teams2": "work",
  "us.zoom.xos": "work", // Zoom
  "com.loom.desktop": "work",
  "com.linear": "work",
  "com.basecamp.bc3-mac": "work",
  "com.clickup.desktop-app": "work",
  "com.asana.app": "work",

  // ── Email ───────────────────────────────────────────────────────────
  "com.apple.mail": "email",
  "com.microsoft.Outlook": "email",
  "com.readdle.smartemail-macos": "email", // Spark
  "com.superhuman.mail": "email",
  "com.freron.MailMate": "email",
  "com.postbox-inc.postbox": "email",
  "com.airmail.Airmail-Beta": "email",
  "it.bloop.airmail2": "email",
  "com.mimestream.Mimestream": "email",
};

/**
 * Get the bundle identifier of the macOS frontmost application.
 * Returns `null` if detection fails (non-macOS, sandbox restriction, etc.).
 */
export function getFrontmostBundleId(): string | null {
  try {
    const raw = execSync(
      `osascript -e 'tell application "System Events" to get bundle identifier of first application process whose frontmost is true'`,
      { timeout: 1500, encoding: "utf8" },
    );
    return raw.trim() || null;
  } catch {
    return null;
  }
}

/**
 * Categorise the current frontmost app into one of the four style
 * categories. Defaults to "other" for unrecognised apps.
 */
export function detectAppCategory(): AppCategory {
  const bundleId = getFrontmostBundleId();
  if (!bundleId) return "other";
  return BUNDLE_CATEGORY[bundleId] ?? "other";
}
