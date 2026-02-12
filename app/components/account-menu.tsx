"use client";

import { LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function AccountMenu({
  userName,
  userEmail,
  profileImageUrl,
  onLogout,
  onNavigateToSettings,
}: {
  userName?: string;
  userEmail?: string;
  profileImageUrl?: string;
  onLogout: () => void;
  onNavigateToSettings: () => void;
}) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const initials = getInitials(userName, userEmail);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-white hover:text-ink"
        title={userEmail}
      >
        <User className="h-5 w-5" />
      </button>

      {/* Dropdown popover */}
      {open && (
        <div
          ref={popoverRef}
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-border bg-white py-3 shadow-lg"
        >
          {/* User info */}
          <div className="flex items-center gap-3.5 px-3 pb-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-base font-semibold text-accent">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0">
              {userName && (
                <p className="truncate text-sm font-semibold text-ink">
                  {userName}
                </p>
              )}
              {userEmail && (
                <p className="mt-0.5 truncate text-xs text-muted">
                  {userEmail}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-border px-3 pt-3">
            <button
              onClick={() => {
                setOpen(false);
                onNavigateToSettings();
              }}
              className="flex w-full items-center justify-start gap-2.5 overflow-hidden rounded-lg px-3 py-2 text-left text-sm font-medium text-ink transition-all hover:bg-sidebar hover:cursor-pointer"
            >
              <User className="h-4 w-4 shrink-0" />
              <span>Manage account</span>
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center justify-start gap-2.5 overflow-hidden rounded-lg px-3 py-2 text-left text-sm font-medium text-ink transition-all hover:bg-sidebar hover:cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "?";
}
