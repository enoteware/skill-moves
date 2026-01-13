"use client";

import React from "react";
import Image from "next/image";
import { ControllerInput, Platform, PlayerDirection, ButtonType, InputDirection } from "@/types/skillMove";
import { getButtonLabel, getStickPosition } from "@/lib/controller";
import { DirectionArrow } from "./DirectionArrow";
import { cn } from "@/lib/utils";

interface ControllerProps {
  input: ControllerInput;
  platform: Platform;
  playerDirection: PlayerDirection;
  className?: string;
  // Animation state props (optional)
  activeButtons?: string[];
  activeLeftStick?: { x: number; y: number } | null;
  activeRightStick?: { x: number; y: number } | null;
}

// PS5 Controller SVG coordinates (viewBox: 0 0 580 360)
const PS5_COORDS = {
  viewBox: "0 0 580 360",
  // Face buttons (diamond layout)
  faceUp: { x: 464.23, y: 69.89 }, // Triangle
  faceRight: { x: 501.34, y: 107 }, // Circle
  faceDown: { x: 464.12, y: 144.11 }, // X
  faceLeft: { x: 427.07, y: 107.06 }, // Square
  
  // Sticks
  leftStick: { x: 209.4, y: 176.33, radius: 20 },
  rightStick: { x: 370.78, y: 176.33, radius: 20 },
  
  // Triggers (approximate positions)
  l1: { x: 135, y: 50 },
  l2: { x: 135, y: 30 },
  r1: { x: 445, y: 50 },
  r2: { x: 445, y: 30 },
};

// Xbox Controller coordinates (viewBox: 0 0 500 500)
const XBOX_COORDS = {
  viewBox: "0 0 500 500",
  // Face buttons (diamond layout)
  faceUp: { x: 323, y: 191.5 }, // Y (yellow)
  faceRight: { x: 352.9, y: 211.6 }, // B (red)
  faceDown: { x: 323, y: 231.8 }, // A (green)
  faceLeft: { x: 293, y: 211.7 }, // X (blue)
  
  // Sticks (based on trigger positions)
  leftStick: { x: 177, y: 211.6, radius: 22 },
  rightStick: { x: 289, y: 256.2, radius: 22 },
  
  // Triggers (LB/LT and RB/RT)
  l1: { x: 177, y: 180 }, // LB (approximate)
  l2: { x: 177, y: 160 }, // LT (approximate)
  r1: { x: 289, y: 220 }, // RB (approximate)
  r2: { x: 289, y: 200 }, // RT (approximate)
};

export function Controller({
  input,
  platform,
  playerDirection,
  className,
  activeButtons,
  activeLeftStick,
  activeRightStick,
}: ControllerProps) {
  const coords = platform === "playstation" ? PS5_COORDS : XBOX_COORDS;

  const getButtonColor = (buttonType: string): string => {
    // PlayStation button colors
    const psColors: Record<string, string> = {
      "face-up": "#578BC5", // Triangle - Blue
      "face-right": "#CF4037", // Circle - Red
      "face-down": "#578BC5", // X - Blue
      "face-left": "#E9C83A", // Square - Yellow
      "l1": "#578BC5",
      "l2": "#578BC5",
      "r1": "#578BC5",
      "r2": "#578BC5",
    };

    // Xbox button colors
    const xboxColors: Record<string, string> = {
      "face-up": "#FFB900", // Y - Yellow
      "face-right": "#E81123", // B - Red
      "face-down": "#107C10", // A - Green
      "face-left": "#0078D4", // X - Blue
      "l1": "#107C10",
      "l2": "#107C10",
      "r1": "#107C10",
      "r2": "#107C10",
    };

    return platform === "playstation" 
      ? psColors[buttonType] || "#578BC5"
      : xboxColors[buttonType] || "#107C10";
  };

  // Handle sequences - show first step, or the direct input if no sequence
  const displayInput = input.sequence && input.sequence.length > 0 ? input.sequence[0] : input;
  const hasSequence = input.sequence && input.sequence.length > 1;

  // Use animation state if provided, otherwise use displayInput
  const hasButtons = activeButtons
    ? activeButtons.length > 0
    : displayInput.buttons && displayInput.buttons.length > 0;
  const hasRightStick = activeRightStick !== undefined ? activeRightStick !== null : !!displayInput.rightStick;
  const hasLeftStick = activeLeftStick !== undefined ? activeLeftStick !== null : !!displayInput.leftStick;

  // Get stick position for right stick
  let rightStickPos = { x: 0.5, y: 0.5 };
  if (activeRightStick !== undefined && activeRightStick !== null) {
    rightStickPos = activeRightStick;
  } else if (displayInput.rightStick) {
    rightStickPos = getStickPosition(displayInput.rightStick.direction, playerDirection);
  }

  // Get stick position for left stick
  let leftStickPos = { x: 0.5, y: 0.5 };
  if (activeLeftStick !== undefined && activeLeftStick !== null) {
    leftStickPos = activeLeftStick;
  } else if (displayInput.leftStick) {
    leftStickPos = getStickPosition(displayInput.leftStick.direction, playerDirection);
  }

  // Determine which buttons are active
  const isButtonActive = (buttonType: string) => {
    if (activeButtons) {
      return activeButtons.includes(buttonType);
    }
    return hasButtons && displayInput.buttons?.includes(buttonType as ButtonType) || false;
  };

  // Calculate stick indicator position within the stick area
  const getStickIndicatorPos = (stickPos: { x: number; y: number }, stickCenter: { x: number; y: number; radius: number }) => {
    // Convert from 0-1 range to -1 to 1 range
    const normalizedX = (stickPos.x - 0.5) * 2;
    const normalizedY = (stickPos.y - 0.5) * 2;
    
    // Calculate position within stick radius (80% of radius to keep it visible)
    const maxDistance = stickCenter.radius * 0.8;
    const x = stickCenter.x + (normalizedX * maxDistance);
    const y = stickCenter.y + (normalizedY * maxDistance);
    
    return { x, y };
  };

  const leftStickIndicator = hasLeftStick ? getStickIndicatorPos(leftStickPos, coords.leftStick) : null;
  const rightStickIndicator = hasRightStick ? getStickIndicatorPos(rightStickPos, coords.rightStick) : null;

  const brandColor = platform === "playstation" ? "#578BC5" : "#107C10";

  const controllerSvg = platform === "playstation" ? "/ps5-controller.svg" : "/xbox-controller.svg";
  const svgAspectRatio = platform === "playstation" ? "580/360" : "500/500";

  return (
    <div className={cn("relative w-full max-w-lg mx-auto", className)}>
      {/* Controller SVG Base */}
      <div className="relative w-full" style={{ aspectRatio: svgAspectRatio }}>
        <Image
          src={controllerSvg}
          alt={`${platform} controller`}
          width={platform === "playstation" ? 580 : 500}
          height={platform === "playstation" ? 360 : 500}
          className="w-full h-full"
          priority
        />

        {/* Overlay Interactive Elements */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={coords.viewBox}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Left Stick Indicator */}
          {leftStickIndicator && (
            <g>
              <circle
                cx={coords.leftStick.x}
                cy={coords.leftStick.y}
                r={coords.leftStick.radius}
                fill="none"
                stroke={brandColor}
                strokeWidth="2"
                strokeOpacity="0.5"
                className="transition-all duration-300"
              />
              <circle
                cx={leftStickIndicator.x}
                cy={leftStickIndicator.y}
                r="4"
                fill={brandColor}
                className="transition-all duration-300"
                    style={{
                  filter: "drop-shadow(0 0 4px currentColor)",
                }}
              />
            </g>
          )}

          {/* Right Stick Indicator */}
          {rightStickIndicator && (
            <g>
              <circle
                cx={coords.rightStick.x}
                cy={coords.rightStick.y}
                r={coords.rightStick.radius}
                fill="none"
                stroke={brandColor}
                strokeWidth="2"
                strokeOpacity="0.5"
                className="transition-all duration-300"
              />
              <circle
                cx={rightStickIndicator.x}
                cy={rightStickIndicator.y}
                r="4"
                fill={brandColor}
                className="transition-all duration-300"
                    style={{
                  filter: "drop-shadow(0 0 4px currentColor)",
                }}
              />
            </g>
          )}

          {/* Face Buttons */}
          {["face-up", "face-right", "face-down", "face-left"].map((buttonType) => {
            const isActive = isButtonActive(buttonType);
            // Convert kebab-case to camelCase for coordinate lookup
            const coordKey = buttonType.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()) as keyof typeof coords;
            const buttonCoords = coords[coordKey] as { x: number; y: number } | undefined;
            if (!buttonCoords) return null;
            const color = getButtonColor(buttonType);
            
            return (
              <g key={buttonType}>
                {isActive && (
                  <circle
                    cx={buttonCoords.x}
                    cy={buttonCoords.y}
                    r="12"
                    fill={color}
                    fillOpacity="0.3"
                    className="transition-all duration-300"
                  />
                )}
                <circle
                  cx={buttonCoords.x}
                  cy={buttonCoords.y}
                  r={isActive ? "10" : "8"}
                  fill={isActive ? color : "none"}
                  stroke={isActive ? color : "#787878"}
                  strokeWidth={isActive ? "2" : "1"}
                  strokeOpacity={isActive ? "1" : "0.5"}
                  className="transition-all duration-300"
                  style={{
                    filter: isActive ? `drop-shadow(0 0 6px ${color})` : "none",
                  }}
                />
                <text
                  x={buttonCoords.x}
                  y={buttonCoords.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="14"
                  fontWeight="bold"
                  fill={isActive ? "#FFFFFF" : "#787878"}
                  className="transition-all duration-300 pointer-events-none"
                >
                  {getButtonLabel(buttonType, platform)}
                </text>
              </g>
            );
          })}

          {/* Triggers */}
          {["l1", "l2", "r1", "r2"].map((buttonType) => {
            const isActive = isButtonActive(buttonType);
            const buttonCoords = coords[buttonType as keyof typeof coords] as { x: number; y: number } | undefined;
            if (!buttonCoords) return null;
            const color = getButtonColor(buttonType);
            
            return (
              <g key={buttonType}>
                {isActive && (
                  <rect
                    x={buttonCoords.x - 20}
                    y={buttonCoords.y - 8}
                    width="40"
                    height="16"
                    rx="4"
                    fill={color}
                    fillOpacity="0.3"
                    className="transition-all duration-300"
                  />
                )}
                <rect
                  x={buttonCoords.x - 20}
                  y={buttonCoords.y - 8}
                  width="40"
                  height="16"
                  rx="4"
                  fill={isActive ? color : "none"}
                  stroke={isActive ? color : "#787878"}
                  strokeWidth={isActive ? "2" : "1"}
                  strokeOpacity={isActive ? "1" : "0.5"}
                  className="transition-all duration-300"
                  style={{
                    filter: isActive ? `drop-shadow(0 0 4px ${color})` : "none",
                  }}
                />
                <text
                  x={buttonCoords.x}
                  y={buttonCoords.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  fontWeight="bold"
                  fill={isActive ? "#FFFFFF" : "#787878"}
                  className="transition-all duration-300 pointer-events-none"
                >
                  {getButtonLabel(buttonType, platform)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Input Description */}
      <div className="mt-4 text-center text-sm text-muted-foreground space-y-1">
        {hasSequence && (
          <div className="font-semibold text-primary">
            Step 1 of {input.sequence!.length} (Sequence Move)
          </div>
        )}
        {hasRightStick && displayInput.rightStick && (
          <div>
            Right Stick: <DirectionArrow direction={displayInput.rightStick.direction as InputDirection} />
            {displayInput.rightStick.hold ? " (Hold)" : " (Flick)"}
          </div>
        )}
        {hasLeftStick && displayInput.leftStick && (
          <div>
            Left Stick: <DirectionArrow direction={displayInput.leftStick.direction as InputDirection} />
            {displayInput.leftStick.hold ? " (Hold)" : " (Flick)"}
          </div>
        )}
        {displayInput.timing && <div>Timing: {displayInput.timing}</div>}
        {displayInput.simultaneous && <div>Press simultaneously</div>}
        {hasSequence && (
          <div className="mt-2 pt-2 border-t text-xs">
            <div className="font-semibold mb-1">Full Sequence:</div>
            {input.sequence!.map((step, index) => (
              <div key={index} className="text-muted-foreground">
                {index + 1}. {step.rightStick && <DirectionArrow direction={step.rightStick.direction as InputDirection} />}
                {step.leftStick && <DirectionArrow direction={step.leftStick.direction as InputDirection} />}
                {step.buttons && step.buttons.map((b) => getButtonLabel(b, platform)).join(" + ")}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
