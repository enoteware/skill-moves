"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Platform } from "@/types/skillMove";
import {
  mapButtonsToTypes,
  mapStickPosition,
  detectControllerType,
  STICK_DEADZONE
} from "./gamepadMapping";

export interface GamepadState {
  connected: boolean;
  controllerType: Platform | null;
  controllerName: string | null;
  activeButtons: string[];
  leftStick: { x: number; y: number } | null;
  rightStick: { x: number; y: number } | null;
}

const INITIAL_STATE: GamepadState = {
  connected: false,
  controllerType: null,
  controllerName: null,
  activeButtons: [],
  leftStick: null,
  rightStick: null,
};

export function useGamepad() {
  const [state, setState] = useState<GamepadState>(INITIAL_STATE);
  const rafRef = useRef<number | null>(null);
  const gamepadIndexRef = useRef<number | null>(null);

  // Handle gamepad connection
  const handleGamepadConnected = useCallback((e: GamepadEvent) => {
    const gamepad = e.gamepad;
    gamepadIndexRef.current = gamepad.index;

    const controllerType = detectControllerType(gamepad.id);

    setState(prev => ({
      ...prev,
      connected: true,
      controllerType,
      controllerName: gamepad.id,
    }));

    console.log(`Gamepad connected: ${gamepad.id} (detected as ${controllerType})`);
  }, []);

  // Handle gamepad disconnection
  const handleGamepadDisconnected = useCallback((e: GamepadEvent) => {
    if (gamepadIndexRef.current === e.gamepad.index) {
      gamepadIndexRef.current = null;
      setState(INITIAL_STATE);
      console.log("Gamepad disconnected");
    }
  }, []);

  // Poll gamepad state at 60fps
  const pollGamepad = useCallback(() => {
    if (gamepadIndexRef.current === null) {
      rafRef.current = requestAnimationFrame(pollGamepad);
      return;
    }

    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[gamepadIndexRef.current];

    if (!gamepad) {
      rafRef.current = requestAnimationFrame(pollGamepad);
      return;
    }

    // Get pressed buttons
    const activeButtons = mapButtonsToTypes(gamepad.buttons);

    // Get stick positions (axes 0,1 = left stick, axes 2,3 = right stick)
    const leftX = gamepad.axes[0] || 0;
    const leftY = gamepad.axes[1] || 0;
    const rightX = gamepad.axes[2] || 0;
    const rightY = gamepad.axes[3] || 0;

    // Apply deadzone and map to 0-1 range (center = 0.5)
    const leftStick = mapStickPosition(leftX, leftY);
    const rightStick = mapStickPosition(rightX, rightY);

    // Only update state if something changed (avoid unnecessary re-renders)
    setState(prev => {
      const buttonsChanged = JSON.stringify(prev.activeButtons) !== JSON.stringify(activeButtons);
      const leftStickChanged = JSON.stringify(prev.leftStick) !== JSON.stringify(leftStick);
      const rightStickChanged = JSON.stringify(prev.rightStick) !== JSON.stringify(rightStick);

      if (!buttonsChanged && !leftStickChanged && !rightStickChanged) {
        return prev;
      }

      return {
        ...prev,
        activeButtons,
        leftStick,
        rightStick,
      };
    });

    rafRef.current = requestAnimationFrame(pollGamepad);
  }, []);

  // Set up event listeners and start polling
  useEffect(() => {
    // Check for already-connected gamepads (page refresh case)
    const gamepads = navigator.getGamepads();
    for (const gamepad of gamepads) {
      if (gamepad) {
        gamepadIndexRef.current = gamepad.index;
        const controllerType = detectControllerType(gamepad.id);
        setState(prev => ({
          ...prev,
          connected: true,
          controllerType,
          controllerName: gamepad.id,
        }));
        break;
      }
    }

    // Add event listeners
    window.addEventListener("gamepadconnected", handleGamepadConnected);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

    // Start polling
    rafRef.current = requestAnimationFrame(pollGamepad);

    // Cleanup
    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnected);
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleGamepadConnected, handleGamepadDisconnected, pollGamepad]);

  return state;
}
