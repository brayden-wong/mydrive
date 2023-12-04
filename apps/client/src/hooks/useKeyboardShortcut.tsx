"use client";

import { KeyboardEvent, useCallback, useEffect } from "react";

type ShortcutAction = (e: KeyboardEvent) => void;

type OptionalConfig = Pick<KeyboardEvent, "altKey" | "ctrlKey" | "shiftKey">;

interface ShortcutConfig {
  code: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  shortcutTarget?: HTMLElement;
}

interface ShortcutConfig extends Partial<OptionalConfig> {
  code: KeyboardEvent["code"];
  shortcutTarget?: HTMLElement;
}

export const useKeyboardShortcut = (
  shortcutAction: ShortcutAction,
  config: ShortcutConfig,
) => {
  const targetElement = config.shortcutTarget || document;

  const eventHandler = useCallback(
    (e: KeyboardEvent) => {
      const { code, ctrlKey, altKey, shiftKey } = e;
      if (config.code !== code) return;
      if (config.ctrlKey && !ctrlKey) return;
      if (config.shiftKey && !shiftKey) return;
      if (config.altKey && !altKey) return;

      shortcutAction(e);
    },
    [shortcutAction, config],
  );

  useEffect(() => {
    targetElement.addEventListener("keydown", eventHandler);
    return () => targetElement.removeEventListener("keydown", eventHandler);
  }, [targetElement, eventHandler]);
};
