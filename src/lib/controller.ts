import { InputDirection, PlayerDirection, ControllerInput } from "@/types/skillMove";

// Convert angle in degrees to one of 8 cardinal directions
export function angleToDirection(angle: number): PlayerDirection {
  // Normalize angle to 0-360
  const normalized = ((angle % 360) + 360) % 360;
  
  // Map to 8 directions (N=0°, NE=45°, E=90°, etc.)
  if (normalized >= 337.5 || normalized < 22.5) return "N";
  if (normalized >= 22.5 && normalized < 67.5) return "NE";
  if (normalized >= 67.5 && normalized < 112.5) return "E";
  if (normalized >= 112.5 && normalized < 157.5) return "SE";
  if (normalized >= 157.5 && normalized < 202.5) return "S";
  if (normalized >= 202.5 && normalized < 247.5) return "SW";
  if (normalized >= 247.5 && normalized < 292.5) return "W";
  return "NW";
}

// Convert relative input direction to absolute stick position based on player facing direction
export function relativeToAbsolute(
  relativeDirection: InputDirection,
  playerDirection: PlayerDirection
): { x: number; y: number } {
  // Map player direction to angle (in degrees, where 0° is up/North)
  const directionAngles: Record<PlayerDirection, number> = {
    N: 0,
    NE: 45,
    E: 90,
    SE: 135,
    S: 180,
    SW: 225,
    W: 270,
    NW: 315,
  };

  // Map relative directions to angles (relative to player facing forward/up)
  const relativeAngles: Record<InputDirection, number> = {
    forward: 0,
    "forward-right": 45,
    right: 90,
    "backward-right": 135,
    backward: 180,
    "backward-left": 225,
    left: 270,
    "forward-left": 315,
  };

  const playerAngle = directionAngles[playerDirection];
  const relativeAngle = relativeAngles[relativeDirection];
  
  // Calculate absolute angle
  const absoluteAngle = (playerAngle + relativeAngle) % 360;
  
  // Convert angle to x, y coordinates (normalized to -1 to 1)
  const radians = (absoluteAngle * Math.PI) / 180;
  const x = Math.sin(radians);
  const y = -Math.cos(radians); // Negative because screen coordinates have y increasing downward
  
  return { x, y };
}

// Get stick position for display (normalized to 0-1 for visual representation)
export function getStickPosition(
  relativeDirection: InputDirection,
  playerDirection: PlayerDirection
): { x: number; y: number } {
  const absolute = relativeToAbsolute(relativeDirection, playerDirection);
  // Convert from -1 to 1 range to 0 to 1 range for display
  return {
    x: (absolute.x + 1) / 2,
    y: (absolute.y + 1) / 2,
  };
}

// Get button label for a platform
export function getButtonLabel(buttonType: string, platform: "playstation" | "xbox"): string {
  const labels: Record<string, { playstation: string; xbox: string }> = {
    "face-up": { playstation: "△", xbox: "Y" },
    "face-down": { playstation: "✕", xbox: "A" },
    "face-left": { playstation: "□", xbox: "X" },
    "face-right": { playstation: "○", xbox: "B" },
    l1: { playstation: "L1", xbox: "LB" },
    l2: { playstation: "L2", xbox: "LT" },
    r1: { playstation: "R1", xbox: "RB" },
    r2: { playstation: "R2", xbox: "RT" },
    "left-stick": { playstation: "L3", xbox: "LS" },
    "right-stick": { playstation: "R3", xbox: "RS" },
  };

  return labels[buttonType]?.[platform] || buttonType;
}

// Get direction label for display
export function getDirectionLabel(direction: InputDirection): string {
  const labels: Record<InputDirection, string> = {
    forward: "Forward",
    backward: "Backward",
    left: "Left",
    right: "Right",
    "forward-left": "Forward-Left",
    "forward-right": "Forward-Right",
    "backward-left": "Backward-Left",
    "backward-right": "Backward-Right",
  };
  return labels[direction] || direction;
}
