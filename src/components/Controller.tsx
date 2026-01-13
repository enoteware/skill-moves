"use client";

import { ControllerInput, Platform, PlayerDirection } from "@/types/skillMove";
import { getButtonLabel, getStickPosition, getDirectionLabel } from "@/lib/controller";
import { cn } from "@/lib/utils";

interface ControllerProps {
  input: ControllerInput;
  platform: Platform;
  playerDirection: PlayerDirection;
  className?: string;
}

export function Controller({ input, platform, playerDirection, className }: ControllerProps) {
  const getButtonClass = (buttonType: string, isActive: boolean) => {
    return cn(
      "transition-all duration-200",
      isActive
        ? "bg-primary text-primary-foreground scale-110 shadow-lg ring-2 ring-primary"
        : "bg-muted text-muted-foreground"
    );
  };

  const getStickClass = (isActive: boolean) => {
    return cn(
      "transition-all duration-200",
      isActive
        ? "bg-primary text-primary-foreground scale-110 shadow-lg ring-2 ring-primary"
        : "bg-muted text-muted-foreground"
    );
  };

  // Handle sequences - show first step, or the direct input if no sequence
  const displayInput = input.sequence && input.sequence.length > 0 ? input.sequence[0] : input;
  const hasSequence = input.sequence && input.sequence.length > 1;

  const hasButtons = displayInput.buttons && displayInput.buttons.length > 0;
  const hasRightStick = !!displayInput.rightStick;
  const hasLeftStick = !!displayInput.leftStick;

  // Get stick position for right stick
  let rightStickPos = { x: 0.5, y: 0.5 };
  if (displayInput.rightStick) {
    rightStickPos = getStickPosition(displayInput.rightStick.direction, playerDirection);
  }

  // Get stick position for left stick
  let leftStickPos = { x: 0.5, y: 0.5 };
  if (displayInput.leftStick) {
    leftStickPos = getStickPosition(displayInput.leftStick.direction, playerDirection);
  }

  return (
    <div className={cn("relative w-full max-w-md mx-auto", className)}>
      <div className="relative bg-slate-900 rounded-2xl p-8 shadow-2xl">
        {/* Controller Body */}
        <div className="relative">
          {/* Left Side */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            {/* Left Stick */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-slate-700 bg-slate-800" />
              {hasLeftStick && (
                <>
                  <div
                    className={cn(
                      "absolute w-3 h-3 rounded-full bg-primary",
                      getStickClass(true)
                    )}
                    style={{
                      left: `${leftStickPos.x * 100}%`,
                      top: `${leftStickPos.y * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                    LS
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {/* Right Stick */}
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-slate-700 bg-slate-800" />
              {hasRightStick && (
                <>
                  <div
                    className={cn(
                      "absolute w-3 h-3 rounded-full bg-primary",
                      getStickClass(true)
                    )}
                    style={{
                      left: `${rightStickPos.x * 100}%`,
                      top: `${rightStickPos.y * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                    RS
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Center - Face Buttons */}
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            {/* Top Button */}
            <button
              className={cn(
                "w-12 h-12 rounded-lg font-bold text-lg mb-2",
                getButtonClass("face-up", hasButtons && displayInput.buttons?.includes("face-up") || false)
              )}
            >
              {getButtonLabel("face-up", platform)}
            </button>

            {/* Middle Row */}
            <div className="flex gap-2 items-center">
              <button
                className={cn(
                  "w-12 h-12 rounded-lg font-bold text-lg",
                  getButtonClass("face-left", hasButtons && displayInput.buttons?.includes("face-left") || false)
                )}
              >
                {getButtonLabel("face-left", platform)}
              </button>
              <div className="w-16" /> {/* Spacer */}
              <button
                className={cn(
                  "w-12 h-12 rounded-lg font-bold text-lg",
                  getButtonClass("face-right", hasButtons && displayInput.buttons?.includes("face-right") || false)
                )}
              >
                {getButtonLabel("face-right", platform)}
              </button>
            </div>

            {/* Bottom Button */}
            <button
              className={cn(
                "w-12 h-12 rounded-lg font-bold text-lg mt-2",
                getButtonClass("face-down", hasButtons && displayInput.buttons?.includes("face-down") || false)
              )}
            >
              {getButtonLabel("face-down", platform)}
            </button>
          </div>

          {/* Triggers */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-4">
            <div
              className={cn(
                "w-16 h-8 rounded-t-lg flex items-center justify-center text-xs font-bold",
                getButtonClass("l2", hasButtons && displayInput.buttons?.includes("l2") || false)
              )}
            >
              {getButtonLabel("l2", platform)}
            </div>
            <div
              className={cn(
                "w-16 h-8 rounded-t-lg flex items-center justify-center text-xs font-bold",
                getButtonClass("r2", hasButtons && displayInput.buttons?.includes("r2") || false)
              )}
            >
              {getButtonLabel("r2", platform)}
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4">
            <div
              className={cn(
                "w-16 h-8 rounded-b-lg flex items-center justify-center text-xs font-bold",
                getButtonClass("l1", hasButtons && displayInput.buttons?.includes("l1") || false)
              )}
            >
              {getButtonLabel("l1", platform)}
            </div>
            <div
              className={cn(
                "w-16 h-8 rounded-b-lg flex items-center justify-center text-xs font-bold",
                getButtonClass("r1", hasButtons && displayInput.buttons?.includes("r1") || false)
              )}
            >
              {getButtonLabel("r1", platform)}
            </div>
          </div>
        </div>
      </div>

      {/* Input Description */}
      <div className="mt-4 text-center text-sm text-muted-foreground space-y-1">
        {hasSequence && (
          <div className="font-semibold text-primary">
            Step 1 of {input.sequence!.length} (Sequence Move)
          </div>
        )}
        {hasRightStick && (
          <div>
            Right Stick: {getDirectionLabel(displayInput.rightStick!.direction)}
            {displayInput.rightStick!.hold ? " (Hold)" : " (Flick)"}
          </div>
        )}
        {hasLeftStick && (
          <div>
            Left Stick: {getDirectionLabel(displayInput.leftStick!.direction)}
            {displayInput.leftStick!.hold ? " (Hold)" : " (Flick)"}
          </div>
        )}
        {displayInput.timing && <div>Timing: {displayInput.timing}</div>}
        {displayInput.simultaneous && <div>Press simultaneously</div>}
        {hasSequence && (
          <div className="mt-2 pt-2 border-t text-xs">
            <div className="font-semibold mb-1">Full Sequence:</div>
            {input.sequence!.map((step, index) => (
              <div key={index} className="text-muted-foreground">
                {index + 1}. {step.rightStick && getDirectionLabel(step.rightStick.direction)}
                {step.leftStick && getDirectionLabel(step.leftStick.direction)}
                {step.buttons && step.buttons.map((b) => getButtonLabel(b, platform)).join(" + ")}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
