"use client";

import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import type { GhosttypeSettings, StylePreferences } from "../types/ghosttype";

/**
 * Keeps the Convex user record in sync with local settings for
 * `shareTranscripts` and `stylePreferences`.
 *
 * - On mount (login), loads cloud prefs and patches local settings if the
 *   cloud has data the local file doesn't yet know about (e.g. logged in
 *   on a new device).
 * - Whenever local settings change, pushes `shareTranscripts` and
 *   `stylePreferences` to the Convex user record.
 */
export function usePreferencesSync(userId: Id<"users"> | null) {
  const updatePreferences = useMutation(api.users.updatePreferences);
  const cloudPrefs = useQuery(
    api.users.getPreferences,
    userId ? { userId } : "skip",
  );

  // Track whether we've already hydrated from the cloud this session
  const hydratedRef = useRef(false);

  // ── Hydrate local settings from cloud on first load ────────────────
  useEffect(() => {
    if (!userId || !cloudPrefs || hydratedRef.current) return;
    if (!window.ghosttype) return;

    hydratedRef.current = true;

    // Only patch local if cloud has style preferences saved
    if (cloudPrefs.stylePreferences) {
      window.ghosttype
        .updateSettings({
          shareTranscripts: cloudPrefs.shareTranscripts,
          stylePreferences: cloudPrefs.stylePreferences as StylePreferences,
        })
        .catch(() => undefined);
    }
  }, [userId, cloudPrefs]);

  // ── Push local → cloud whenever settings change ────────────────────
  useEffect(() => {
    if (!userId || !window.ghosttype) return;

    const unsubscribe = window.ghosttype.onSettings(
      (settings: GhosttypeSettings) => {
        updatePreferences({
          userId,
          shareTranscripts: settings.shareTranscripts,
          stylePreferences: settings.stylePreferences,
        }).catch(() => undefined);
      },
    );

    return unsubscribe;
  }, [userId, updatePreferences]);
}
