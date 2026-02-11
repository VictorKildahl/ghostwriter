import { UiohookKey, uIOhook } from "uiohook-napi";
import {
  formatShortcutPreview,
  isModifierKeycode,
  shortcutFromKeycode,
  type GhostingShortcut,
} from "./settings";

type GhostingHotkeyHandlers = {
  getShortcut: () => GhostingShortcut;
  getToggleShortcut: () => GhostingShortcut | null;
  isCaptureActive: () => boolean;
  onCapturePreview: (preview: string) => void;
  onCaptureComplete: (shortcut: GhostingShortcut) => void | Promise<void>;
  onStart: () => void | Promise<void>;
  onStop: () => void | Promise<void>;
  onToggle: () => void | Promise<void>;
};

const isMetaPressed = (pressed: Set<number>) =>
  pressed.has(UiohookKey.Meta) || pressed.has(UiohookKey.MetaRight);

const isShiftPressed = (pressed: Set<number>) =>
  pressed.has(UiohookKey.Shift) || pressed.has(UiohookKey.ShiftRight);

const isAltPressed = (pressed: Set<number>) =>
  pressed.has(UiohookKey.Alt) || pressed.has(UiohookKey.AltRight);

const isCtrlPressed = (pressed: Set<number>) =>
  pressed.has(UiohookKey.Ctrl) || pressed.has(UiohookKey.CtrlRight);

function getModifiers(pressed: Set<number>) {
  return {
    meta: isMetaPressed(pressed),
    shift: isShiftPressed(pressed),
    alt: isAltPressed(pressed),
    ctrl: isCtrlPressed(pressed),
  };
}

function matchesShortcut(pressed: Set<number>, shortcut: GhostingShortcut) {
  const modifiers = getModifiers(pressed);

  return (
    modifiers.meta === shortcut.meta &&
    modifiers.shift === shortcut.shift &&
    modifiers.alt === shortcut.alt &&
    modifiers.ctrl === shortcut.ctrl
  );
}

export function registerGhostingHotkey({
  getShortcut,
  getToggleShortcut,
  isCaptureActive,
  onCapturePreview,
  onCaptureComplete,
  onStart,
  onStop,
  onToggle,
}: GhostingHotkeyHandlers) {
  const pressed = new Set<number>();
  let isActive = false;
  // Guard against rapid repeated toggle presses
  let toggleCooldown = false;

  uIOhook.on("keydown", (event) => {
    pressed.add(event.keycode);

    if (isCaptureActive()) {
      const modifiers = getModifiers(pressed);
      if (isModifierKeycode(event.keycode)) {
        onCapturePreview(formatShortcutPreview(modifiers));
        return;
      }

      try {
        const shortcut = shortcutFromKeycode(event.keycode, modifiers);
        onCapturePreview(formatShortcutPreview(modifiers, shortcut.key));
        onCaptureComplete(shortcut);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Invalid shortcut";
        onCapturePreview(message);
      }
      return;
    }

    // Check toggle shortcut first
    const toggleShortcut = getToggleShortcut();
    if (
      toggleShortcut &&
      event.keycode === toggleShortcut.keycode &&
      matchesShortcut(pressed, toggleShortcut) &&
      !toggleCooldown
    ) {
      toggleCooldown = true;
      setTimeout(() => {
        toggleCooldown = false;
      }, 300);
      onToggle();
      return;
    }

    // Hold-to-record shortcut
    const shortcut = getShortcut();
    if (
      event.keycode === shortcut.keycode &&
      matchesShortcut(pressed, shortcut) &&
      !isActive
    ) {
      isActive = true;
      onStart();
    }
  });

  uIOhook.on("keyup", (event) => {
    pressed.delete(event.keycode);

    if (isCaptureActive()) {
      const modifiers = getModifiers(pressed);
      onCapturePreview(formatShortcutPreview(modifiers));
      return;
    }

    const shortcut = getShortcut();
    if (event.keycode === shortcut.keycode && isActive) {
      isActive = false;
      onStop();
    }
  });

  uIOhook.start();

  return () => {
    uIOhook.removeAllListeners();
    uIOhook.stop();
  };
}
