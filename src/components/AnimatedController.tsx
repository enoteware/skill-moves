"use client";

import React, { useImperativeHandle, forwardRef } from "react";
import { ControllerInput, Platform, PlayerDirection, InputDirection } from "@/types/skillMove";
import { Controller } from "./Controller";
import { useAnimation } from "@/lib/useAnimation";
import { getStickPosition } from "@/lib/controller";

export interface AnimatedControllerRef {
  reset: () => void;
}

interface AnimatedControllerProps {
  input: ControllerInput;
  platform: Platform;
  playerDirection: PlayerDirection;
  speed: number;
  loop: boolean;
  isPlaying: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

export const AnimatedController = forwardRef<AnimatedControllerRef, AnimatedControllerProps>(
  (
    {
      input,
      platform,
      playerDirection,
      speed,
      loop,
      isPlaying: externalIsPlaying,
      onPlayStateChange,
      className,
    },
    ref
  ) => {
    const animation = useAnimation({
      input,
      speed,
      loop,
      playerDirection,
      getStickPosition: (direction, playerDir) => {
        return getStickPosition(direction as InputDirection, playerDir as PlayerDirection);
      },
    });

    // Expose reset method via ref
    useImperativeHandle(ref, () => ({
      reset: () => {
        animation.reset();
      },
    }));

    // Sync external play state
    React.useEffect(() => {
      if (externalIsPlaying && !animation.isPlaying) {
        animation.play();
      } else if (!externalIsPlaying && animation.isPlaying) {
        animation.pause();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [externalIsPlaying]);

    // Notify parent of play state changes
    React.useEffect(() => {
      onPlayStateChange?.(animation.isPlaying);
    }, [animation.isPlaying, onPlayStateChange]);

    return (
      <Controller
        input={input}
        platform={platform}
        playerDirection={playerDirection}
        className={className}
        activeButtons={animation.activeButtons}
        activeLeftStick={animation.activeLeftStick}
        activeRightStick={animation.activeRightStick}
      />
    );
  }
);

AnimatedController.displayName = "AnimatedController";
