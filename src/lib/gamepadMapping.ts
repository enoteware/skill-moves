import { ButtonType } from "@/types/skillMove";

// Deadzone threshold for analog sticks
export const STICK_DEADZONE = 0.15;

// Trigger threshold (L2/R2 are analog on most controllers)
export const TRIGGER_THRESHOLD = 0.5;

/**
 * Standard Gamepad button indices (based on W3C Gamepad API)
 * Note: PlayStation and Xbox use the same indices, just different labels
 */
export const BUTTON_INDICES = {
  // Face buttons (diamond layout)
  FACE_DOWN: 0,    // X (PS) / A (Xbox)
  FACE_RIGHT: 1,   // Circle (PS) / B (Xbox)
  FACE_LEFT: 2,    // Square (PS) / X (Xbox)
  FACE_UP: 3,      // Triangle (PS) / Y (Xbox)

  // Shoulder buttons
  L1: 4,           // L1 (PS) / LB (Xbox)
  R1: 5,           // R1 (PS) / RB (Xbox)
  L2: 6,           // L2 (PS) / LT (Xbox)
  R2: 7,           // R2 (PS) / RT (Xbox)

  // Center buttons
  SELECT: 8,       // Share (PS) / Back (Xbox)
  START: 9,        // Options (PS) / Start (Xbox)

  // Stick presses
  LEFT_STICK: 10,  // L3 (PS) / LS (Xbox)
  RIGHT_STICK: 11, // R3 (PS) / RS (Xbox)

  // D-pad
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
} as const;

/**
 * Map button index to our ButtonType
 */
const BUTTON_INDEX_TO_TYPE: Record<number, ButtonType> = {
  [BUTTON_INDICES.FACE_DOWN]: "face-down",
  [BUTTON_INDICES.FACE_RIGHT]: "face-right",
  [BUTTON_INDICES.FACE_LEFT]: "face-left",
  [BUTTON_INDICES.FACE_UP]: "face-up",
  [BUTTON_INDICES.L1]: "l1",
  [BUTTON_INDICES.R1]: "r1",
  [BUTTON_INDICES.L2]: "l2",
  [BUTTON_INDICES.R2]: "r2",
  [BUTTON_INDICES.LEFT_STICK]: "left-stick",
  [BUTTON_INDICES.RIGHT_STICK]: "right-stick",
};

/**
 * Detect controller type from gamepad ID string
 */
export function detectControllerType(gamepadId: string): "playstation" | "xbox" {
  const id = gamepadId.toLowerCase();

  // PlayStation controllers
  if (
    id.includes("playstation") ||
    id.includes("dualshock") ||
    id.includes("dualsense") ||
    id.includes("054c") || // Sony vendor ID
    id.includes("ps4") ||
    id.includes("ps5")
  ) {
    return "playstation";
  }

  // Xbox controllers
  if (
    id.includes("xbox") ||
    id.includes("microsoft") ||
    id.includes("045e") || // Microsoft vendor ID
    id.includes("xinput")
  ) {
    return "xbox";
  }

  // Default to Xbox mapping (most common standard)
  return "xbox";
}

/**
 * Map pressed gamepad buttons to our ButtonType array
 */
export function mapButtonsToTypes(buttons: readonly GamepadButton[]): string[] {
  const activeButtons: string[] = [];

  buttons.forEach((button, index) => {
    const buttonType = BUTTON_INDEX_TO_TYPE[index];
    if (!buttonType) return;

    // For triggers (L2/R2), check value against threshold
    if (index === BUTTON_INDICES.L2 || index === BUTTON_INDICES.R2) {
      if (button.value >= TRIGGER_THRESHOLD) {
        activeButtons.push(buttonType);
      }
    } else {
      // For other buttons, just check pressed state
      if (button.pressed) {
        activeButtons.push(buttonType);
      }
    }
  });

  return activeButtons;
}

/**
 * Map raw stick axes to our position format
 * Input: -1 to 1 (from Gamepad API)
 * Output: 0 to 1 (for our controller visualization, center = 0.5)
 * Returns null if within deadzone
 */
export function mapStickPosition(
  x: number,
  y: number
): { x: number; y: number } | null {
  // Calculate magnitude for deadzone check
  const magnitude = Math.sqrt(x * x + y * y);

  if (magnitude < STICK_DEADZONE) {
    return null; // Within deadzone, treat as centered
  }

  // Convert from -1...1 to 0...1 range (center = 0.5)
  return {
    x: (x + 1) / 2,
    y: (y + 1) / 2,
  };
}

/**
 * Get the direction name from stick position
 * Used for comparing user input against expected input
 */
export function getStickDirection(
  x: number,
  y: number
): string | null {
  // Convert from 0-1 to -1 to 1 for angle calculation
  const normalizedX = (x - 0.5) * 2;
  const normalizedY = (y - 0.5) * 2;

  const magnitude = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);

  if (magnitude < STICK_DEADZONE * 2) {
    return null; // Centered
  }

  // Calculate angle (0 = right, 90 = down, 180 = left, 270 = up)
  let angle = Math.atan2(normalizedY, normalizedX) * (180 / Math.PI);
  if (angle < 0) angle += 360;

  // Map angle to 8 directions
  if (angle >= 337.5 || angle < 22.5) return "right";
  if (angle >= 22.5 && angle < 67.5) return "forward-right"; // down-right in screen coords
  if (angle >= 67.5 && angle < 112.5) return "forward"; // down in screen coords
  if (angle >= 112.5 && angle < 157.5) return "forward-left"; // down-left
  if (angle >= 157.5 && angle < 202.5) return "left";
  if (angle >= 202.5 && angle < 247.5) return "backward-left"; // up-left
  if (angle >= 247.5 && angle < 292.5) return "backward"; // up
  if (angle >= 292.5 && angle < 337.5) return "backward-right"; // up-right

  return null;
}
