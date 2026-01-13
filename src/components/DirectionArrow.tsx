"use client";

import { InputDirection, PlayerDirection } from "@/types/skillMove";
import { cn } from "@/lib/utils";

interface DirectionArrowProps {
  direction: InputDirection | PlayerDirection;
  className?: string;
  showText?: boolean;
}

// Arrow symbols for InputDirection
const inputDirectionArrows: Record<InputDirection, string> = {
  forward: "↑",
  backward: "↓",
  left: "←",
  right: "→",
  "forward-left": "↖",
  "forward-right": "↗",
  "backward-left": "↙",
  "backward-right": "↘",
};

// Arrow symbols for PlayerDirection (cardinal directions)
const playerDirectionArrows: Record<PlayerDirection, string> = {
  N: "↑",
  NE: "↗",
  E: "→",
  SE: "↘",
  S: "↓",
  SW: "↙",
  W: "←",
  NW: "↖",
};

// Direction labels for InputDirection
const inputDirectionLabels: Record<InputDirection, string> = {
  forward: "Forward",
  backward: "Backward",
  left: "Left",
  right: "Right",
  "forward-left": "Forward-Left",
  "forward-right": "Forward-Right",
  "backward-left": "Backward-Left",
  "backward-right": "Backward-Right",
};

// Direction labels for PlayerDirection
const playerDirectionLabels: Record<PlayerDirection, string> = {
  N: "North",
  NE: "Northeast",
  E: "East",
  SE: "Southeast",
  S: "South",
  SW: "Southwest",
  W: "West",
  NW: "Northwest",
};

export function DirectionArrow({ direction, className, showText = true }: DirectionArrowProps) {
  // Check if it's a PlayerDirection (cardinal) or InputDirection
  const isPlayerDirection = direction in playerDirectionArrows;
  
  const arrow = isPlayerDirection 
    ? playerDirectionArrows[direction as PlayerDirection] 
    : inputDirectionArrows[direction as InputDirection] || "";
  
  const label = isPlayerDirection
    ? playerDirectionLabels[direction as PlayerDirection]
    : inputDirectionLabels[direction as InputDirection] || direction;

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="text-lg leading-none" aria-hidden="true">
        {arrow}
      </span>
      {showText && <span>{label}</span>}
    </span>
  );
}
