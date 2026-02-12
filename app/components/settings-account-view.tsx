"use client";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState, type ChangeEvent } from "react";

export type SettingsAccountViewProps = {
  userId: Id<"users">;
  onAccountDeleted: () => void;
  onSignOut: () => void;
};

export function SettingsAccountView({
  userId,
  onAccountDeleted,
  onSignOut,
}: SettingsAccountViewProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const profile = useQuery(api.users.getProfile, { userId });
  const updateProfileMutation = useMutation(api.users.updateProfile);
  const deleteAccountMutation = useMutation(api.users.deleteAccount);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.firstName ?? "");
    setLastName(profile.lastName ?? "");
    setProfileImageUrl(profile.profileImageUrl ?? "");
  }, [profile]);

  const accountInitials = `${firstName.trim().charAt(0)}${lastName
    .trim()
    .charAt(0)}`
    .trim()
    .toUpperCase();

  async function readImageAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const value = typeof reader.result === "string" ? reader.result : null;
        if (!value) {
          reject(new Error("Could not read image file."));
          return;
        }
        resolve(value);
      };
      reader.onerror = () => reject(new Error("Could not read image file."));
      reader.readAsDataURL(file);
    });
  }

  async function onProfileImageSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 1_500_000) {
      setProfileError("Profile image must be 1.5MB or smaller.");
      return;
    }
    try {
      const dataUrl = await readImageAsDataUrl(file);
      setProfileImageUrl(dataUrl);
      setProfileError(null);
      setProfileMessage(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load image.";
      setProfileError(message);
    }
  }

  async function saveProfile() {
    setProfileSaving(true);
    setProfileError(null);
    setProfileMessage(null);
    try {
      await updateProfileMutation({
        userId,
        firstName,
        lastName,
        profileImageUrl,
      });
      setProfileMessage("Account profile updated.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update profile.";
      setProfileError(message);
    } finally {
      setProfileSaving(false);
    }
  }

  async function deleteAccount() {
    const confirmed = window.confirm(
      "Delete your account permanently? This removes your profile, sessions, dictionary, snippets, and usage history.",
    );
    if (!confirmed) return;
    const phrase = window.prompt("Type DELETE to confirm account deletion.");
    if (phrase !== "DELETE") {
      setProfileError("Account deletion cancelled.");
      return;
    }
    setDeletingAccount(true);
    setProfileError(null);
    try {
      await deleteAccountMutation({ userId });
      onAccountDeleted();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete account.";
      setProfileError(message);
      setDeletingAccount(false);
    }
  }

  const email = profile?.email ?? "";
  return (
    <div className="flex flex-col">
      <div className="divide-y divide-border">
        {/* First name */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm font-medium text-ink">First name</span>
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First name"
            className="w-48 rounded-lg border border-border bg-sidebar px-3 py-2 text-sm text-ink text-right placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        {/* Last name */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm font-medium text-ink">Last name</span>
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Last name"
            className="w-48 rounded-lg border border-border bg-sidebar px-3 py-2 text-sm text-ink text-right placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        {/* Email */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm font-medium text-ink">Email</span>
          <span className="text-sm text-muted">{email}</span>
        </div>

        {/* Profile picture */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm font-medium text-ink">Profile picture</span>
          <div className="flex items-center gap-3">
            {profileImageUrl && (
              <button
                type="button"
                className="text-xs text-muted transition hover:text-ink hover:cursor-pointer"
                onClick={() => setProfileImageUrl("")}
              >
                Remove
              </button>
            )}
            <label className="hover:cursor-pointer">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/10 text-xs font-semibold text-accent transition hover:ring-2 hover:ring-accent/40">
                {profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  accountInitials || "?"
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onProfileImageSelected}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Status messages */}
      {profileMessage && (
        <p className="mt-3 text-xs text-accent">{profileMessage}</p>
      )}
      {profileError && (
        <p className="mt-3 text-xs text-ember">{profileError}</p>
      )}

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-ink transition hover:bg-sidebar hover:cursor-pointer"
          >
            Sign out
          </button>
          <button
            type="button"
            onClick={deleteAccount}
            disabled={profileSaving || deletingAccount}
            className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted transition hover:bg-sidebar hover:text-ember disabled:opacity-50 hover:cursor-pointer"
          >
            {deletingAccount ? "Deleting..." : "Delete account"}
          </button>
        </div>
        <button
          type="button"
          onClick={saveProfile}
          disabled={profileSaving || deletingAccount}
          className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white transition hover:bg-accent/90 disabled:opacity-50 hover:cursor-pointer"
        >
          {profileSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
