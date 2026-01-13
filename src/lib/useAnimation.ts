"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ControllerInput } from "@/types/skillMove";

export interface AnimationState {
  isPlaying: boolean;
  currentStep: number;
  activeButtons: string[];
  activeLeftStick: { x: number; y: number } | null;
  activeRightStick: { x: number; y: number } | null;
}

interface UseAnimationOptions {
  input: ControllerInput;
  speed: number; // 0.5 to 2.0
  loop: boolean;
  playerDirection: string;
  getStickPosition: (direction: string, playerDir: string) => { x: number; y: number };
}

const DEFAULT_HOLD_DURATION = 800; // ms
const DEFAULT_FLICK_DURATION = 200; // ms
const STEP_TRANSITION_DURATION = 300; // ms

export function useAnimation({
  input,
  speed,
  loop,
  playerDirection,
  getStickPosition,
}: UseAnimationOptions) {
  const [state, setState] = useState<AnimationState>({
    isPlaying: false,
    currentStep: -1,
    activeButtons: [],
    activeLeftStick: null,
    activeRightStick: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sequenceRef = useRef<ControllerInput[]>([]);

  // Build the sequence from the input
  const buildSequence = useCallback((input: ControllerInput): ControllerInput[] => {
    const sequence: ControllerInput[] = [];
    
    // Add initial input if it has buttons or sticks
    if (input.buttons || input.rightStick || input.leftStick) {
      sequence.push({
        buttons: input.buttons,
        rightStick: input.rightStick,
        leftStick: input.leftStick,
        simultaneous: input.simultaneous,
        timing: input.timing,
      });
    }

    // Add sequence steps
    if (input.sequence) {
      sequence.push(...input.sequence);
    }

    return sequence.length > 0 ? sequence : [input];
  }, []);

  // Reset to initial state
  const reset = useCallback(() => {
    setState({
      isPlaying: false,
      currentStep: -1,
      activeButtons: [],
      activeLeftStick: null,
      activeRightStick: null,
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Play a single step
  const playStep = useCallback((stepIndex: number) => {
    const sequence = sequenceRef.current;
    if (stepIndex >= sequence.length) {
      // Sequence complete
      if (loop) {
        // Loop: restart from beginning
        timeoutRef.current = setTimeout(() => {
          setState((prev) => ({ ...prev, currentStep: -1 }));
          playStep(0);
        }, STEP_TRANSITION_DURATION / speed);
      } else {
        // No loop: stop
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          currentStep: -1,
          activeButtons: [],
          activeLeftStick: null,
          activeRightStick: null,
        }));
      }
      return;
    }

    const step = sequence[stepIndex];
    
    // Determine active inputs for this step
    const activeButtons = step.buttons || [];
    let activeLeftStick: { x: number; y: number } | null = null;
    let activeRightStick: { x: number; y: number } | null = null;

    if (step.leftStick) {
      activeLeftStick = getStickPosition(step.leftStick.direction, playerDirection);
    }

    if (step.rightStick) {
      activeRightStick = getStickPosition(step.rightStick.direction, playerDirection);
    }

    // Update state with active inputs
    setState((prev) => ({
      ...prev,
      currentStep: stepIndex,
      activeButtons,
      activeLeftStick,
      activeRightStick,
    }));

    // Calculate duration based on timing
    let duration = DEFAULT_FLICK_DURATION;
    if (step.leftStick?.hold || step.rightStick?.hold) {
      duration = DEFAULT_HOLD_DURATION;
    } else if (step.timing === "hold") {
      duration = DEFAULT_HOLD_DURATION;
    } else if (step.timing === "flick" || step.timing === "tap") {
      duration = DEFAULT_FLICK_DURATION;
    }

    // Apply speed multiplier
    const adjustedDuration = duration / speed;

    // Schedule next step
    timeoutRef.current = setTimeout(() => {
      // Clear active inputs if they're flicks
      if (!step.leftStick?.hold && !step.rightStick?.hold && step.timing !== "hold") {
        setState((prev) => ({
          ...prev,
          activeButtons: [],
          activeLeftStick: null,
          activeRightStick: null,
        }));
        
        // Small delay before next step
        timeoutRef.current = setTimeout(() => {
          playStep(stepIndex + 1);
        }, STEP_TRANSITION_DURATION / speed);
      } else {
        // Hold inputs: move to next step while keeping them active
        playStep(stepIndex + 1);
      }
    }, adjustedDuration);
  }, [speed, loop, playerDirection, getStickPosition]);

  // Start playing
  const play = useCallback(() => {
    sequenceRef.current = buildSequence(input);
    setState((prev) => ({ ...prev, isPlaying: true }));
    playStep(0);
  }, [input, buildSequence, playStep]);

  // Pause
  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      if (state.currentStep === -1) {
        play();
      } else {
        // Resume from current step
        setState((prev) => ({ ...prev, isPlaying: true }));
        playStep(state.currentStep);
      }
    }
  }, [state.isPlaying, state.currentStep, pause, play, playStep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Rebuild sequence when input changes
  useEffect(() => {
    sequenceRef.current = buildSequence(input);
    if (!state.isPlaying) {
      reset();
    }
  }, [input, buildSequence, reset, state.isPlaying]);

  // Handle speed or loop changes while playing
  useEffect(() => {
    if (state.isPlaying && state.currentStep >= 0) {
      // Restart from current step with new settings
      const wasPlaying = state.isPlaying;
      const currentStep = state.currentStep;
      pause();
      const timeoutId = setTimeout(() => {
        if (wasPlaying) {
          setState((prev) => ({ ...prev, isPlaying: true }));
          playStep(currentStep);
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, loop]); // Only react to speed/loop changes

  return {
    ...state,
    play,
    pause,
    toggle,
    reset,
  };
}
