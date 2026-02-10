"use client";

import { AccountMenu } from "@/app/components/account-menu";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function Header({
  userName,
  userEmail,
  onLogout,
  sidebarCollapsed,
  onToggleSidebar,
}: {
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}) {
  return (
    <header className="title-bar flex h-12 shrink-0 items-center justify-end bg-sidebar px-4">
      <button
        onClick={onToggleSidebar}
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="no-drag fixed left-24 top-2.75 z-50 flex items-center justify-center rounded-lg p-1.5 text-ink transition hover:bg-white"
      >
        {sidebarCollapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>

      <div className="no-drag">
        <AccountMenu
          userName={userName}
          userEmail={userEmail}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
