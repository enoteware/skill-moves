export type Platform = "playstation" | "xbox";

export type PlayerDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export type InputDirection = "forward" | "backward" | "left" | "right" | "forward-left" | "forward-right" | "backward-left" | "backward-right";

export type ButtonType = 
  | "face-up"      // Triangle/Y
  | "face-down"    // X/A
  | "face-left"    // Square/X
  | "face-right"   // Circle/B
  | "l1"           // L1/LB
  | "l2"           // L2/LT
  | "r1"           // R1/RB
  | "r2"           // R2/RT
  | "left-stick"   // Left stick press
  | "right-stick"; // Right stick press

export interface StickInput {
  direction: InputDirection;
  hold?: boolean; // If true, hold the stick; if false, flick it
}

export interface ControllerInput {
  buttons?: ButtonType[];
  rightStick?: StickInput;
  leftStick?: StickInput;
  simultaneous?: boolean; // If buttons and stick should be pressed simultaneously
  sequence?: ControllerInput[]; // For multi-step moves
  timing?: "hold" | "flick" | "tap"; // Timing for the input
}

export interface SkillMove {
  id: string;
  name: string;
  description: string;
  starRating: 1 | 2 | 3 | 4 | 5;
  inputs: ControllerInput;
  category?: string; // e.g., "dribbling", "turning", "advanced"
}
