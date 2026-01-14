"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Controller } from "./Controller";
import { GamepadStatus } from "./GamepadStatus";
import { useGamepad } from "@/lib/useGamepad";
import { getStickDirection } from "@/lib/gamepadMapping";
import { SkillMove, Platform, PlayerDirection, ControllerInput } from "@/types/skillMove";
import { getStickPosition } from "@/lib/controller";
import { cn } from "@/lib/utils";
import { Check, X, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface PracticeModeProps {
  skillMove: SkillMove;
  platform: Platform;
  playerDirection: PlayerDirection;
  className?: string;
}

interface StepStatus {
  matched: boolean;
  attempted: boolean;
}

export function PracticeMode({
  skillMove,
  platform,
  playerDirection,
  className,
}: PracticeModeProps) {
  const gamepad = useGamepad();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Build the sequence of steps from the skill move
  const sequence = useMemo(() => {
    const steps: ControllerInput[] = [];

    // Add initial input if it has buttons or sticks
    if (skillMove.inputs.buttons || skillMove.inputs.rightStick || skillMove.inputs.leftStick) {
      steps.push({
        buttons: skillMove.inputs.buttons,
        rightStick: skillMove.inputs.rightStick,
        leftStick: skillMove.inputs.leftStick,
        simultaneous: skillMove.inputs.simultaneous,
        timing: skillMove.inputs.timing,
      });
    }

    // Add sequence steps
    if (skillMove.inputs.sequence) {
      steps.push(...skillMove.inputs.sequence);
    }

    return steps.length > 0 ? steps : [skillMove.inputs];
  }, [skillMove.inputs]);

  // Initialize step statuses
  useEffect(() => {
    setStepStatuses(sequence.map(() => ({ matched: false, attempted: false })));
    setCurrentStepIndex(0);
    setIsComplete(false);
    setShowSuccess(false);
  }, [sequence]);

  // Check if current user input matches the expected step
  const checkInputMatch = (
    expected: ControllerInput,
    userButtons: string[],
    userLeftStick: { x: number; y: number } | null,
    userRightStick: { x: number; y: number } | null
  ): boolean => {
    // Check buttons match
    const expectedButtons = expected.buttons || [];
    const buttonsMatch =
      expectedButtons.length === 0 ||
      expectedButtons.every((btn) => userButtons.includes(btn));

    // Check left stick match
    let leftStickMatch = true;
    if (expected.leftStick) {
      if (!userLeftStick) {
        leftStickMatch = false;
      } else {
        const userDirection = getStickDirection(userLeftStick.x, userLeftStick.y);
        leftStickMatch = userDirection === expected.leftStick.direction;
      }
    }

    // Check right stick match
    let rightStickMatch = true;
    if (expected.rightStick) {
      if (!userRightStick) {
        rightStickMatch = false;
      } else {
        const userDirection = getStickDirection(userRightStick.x, userRightStick.y);
        rightStickMatch = userDirection === expected.rightStick.direction;
      }
    }

    return buttonsMatch && leftStickMatch && rightStickMatch;
  };

  // Monitor gamepad input and check against expected
  useEffect(() => {
    if (!gamepad.connected || isComplete) return;

    const currentStep = sequence[currentStepIndex];
    if (!currentStep) return;

    const hasAnyInput =
      gamepad.activeButtons.length > 0 ||
      gamepad.leftStick !== null ||
      gamepad.rightStick !== null;

    if (!hasAnyInput) return;

    const isMatch = checkInputMatch(
      currentStep,
      gamepad.activeButtons,
      gamepad.leftStick,
      gamepad.rightStick
    );

    if (isMatch) {
      // Mark current step as matched
      setStepStatuses((prev) => {
        const updated = [...prev];
        updated[currentStepIndex] = { matched: true, attempted: true };
        return updated;
      });

      // Move to next step or complete
      if (currentStepIndex < sequence.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsComplete(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    }
  }, [
    gamepad.connected,
    gamepad.activeButtons,
    gamepad.leftStick,
    gamepad.rightStick,
    currentStepIndex,
    sequence,
    isComplete,
  ]);

  // Reset practice
  const handleReset = () => {
    setStepStatuses(sequence.map(() => ({ matched: false, attempted: false })));
    setCurrentStepIndex(0);
    setIsComplete(false);
    setShowSuccess(false);
  };

  // Get expected input visualization for current step
  const currentStep = sequence[currentStepIndex];
  const expectedRightStick = currentStep?.rightStick
    ? getStickPosition(currentStep.rightStick.direction, playerDirection)
    : null;
  const expectedLeftStick = currentStep?.leftStick
    ? getStickPosition(currentStep.leftStick.direction, playerDirection)
    : null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Gamepad Status */}
      <GamepadStatus
        connected={gamepad.connected}
        controllerType={gamepad.controllerType}
        controllerName={gamepad.controllerName}
      />

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-green-500 text-white px-8 py-4 rounded-2xl text-2xl font-bold animate-bounce shadow-2xl">
            Perfect!
          </div>
        </div>
      )}

      {/* Controller with live input */}
      <div className="relative">
        <Controller
          input={skillMove.inputs}
          platform={gamepad.controllerType || platform}
          playerDirection={playerDirection}
          activeButtons={gamepad.activeButtons}
          activeLeftStick={gamepad.leftStick}
          activeRightStick={gamepad.rightStick}
        />

        {/* Match indicator overlay */}
        {gamepad.connected && !isComplete && (
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <div
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                checkInputMatch(
                  currentStep,
                  gamepad.activeButtons,
                  gamepad.leftStick,
                  gamepad.rightStick
                )
                  ? "bg-green-500 animate-pulse"
                  : gamepad.activeButtons.length > 0 ||
                      gamepad.leftStick ||
                      gamepad.rightStick
                    ? "bg-yellow-500"
                    : "bg-gray-400"
              )}
            />
          </div>
        )}
      </div>

      {/* Step Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Step {currentStepIndex + 1} of {sequence.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1">
          {sequence.map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 h-2 rounded-full transition-colors",
                stepStatuses[index]?.matched
                  ? "bg-green-500"
                  : index === currentStepIndex
                    ? "bg-primary"
                    : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Expected Input Display */}
      {currentStep && !isComplete && (
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Expected Input:
          </div>
          <div className="flex flex-wrap gap-2">
            {currentStep.buttons?.map((btn) => (
              <span
                key={btn}
                className={cn(
                  "px-2 py-1 rounded text-xs font-mono",
                  gamepad.activeButtons.includes(btn)
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-background"
                )}
              >
                {btn.toUpperCase()}
              </span>
            ))}
            {currentStep.rightStick && (
              <span
                className={cn(
                  "px-2 py-1 rounded text-xs font-mono",
                  gamepad.rightStick &&
                    getStickDirection(gamepad.rightStick.x, gamepad.rightStick.y) ===
                      currentStep.rightStick.direction
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-background"
                )}
              >
                R-Stick: {currentStep.rightStick.direction}
                {currentStep.rightStick.hold ? " (hold)" : " (flick)"}
              </span>
            )}
            {currentStep.leftStick && (
              <span
                className={cn(
                  "px-2 py-1 rounded text-xs font-mono",
                  gamepad.leftStick &&
                    getStickDirection(gamepad.leftStick.x, gamepad.leftStick.y) ===
                      currentStep.leftStick.direction
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-background"
                )}
              >
                L-Stick: {currentStep.leftStick.direction}
                {currentStep.leftStick.hold ? " (hold)" : " (flick)"}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Completion State */}
      {isComplete && (
        <div className="p-4 bg-green-500/10 rounded-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-green-600 dark:text-green-400">
              Skill Move Complete!
            </div>
            <div className="text-sm text-muted-foreground">
              You nailed the {skillMove.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
