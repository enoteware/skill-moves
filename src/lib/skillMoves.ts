import { SkillMove } from "@/types/skillMove";

export const skillMoves: SkillMove[] = [
  // 1-Star Skill Moves
  {
    id: "ball-roll",
    name: "Ball Roll",
    description: "A simple move that allows the player to roll the ball to the side, useful for maintaining possession and changing direction slightly.",
    starRating: 1,
    category: "basic",
    inputs: {
      rightStick: {
        direction: "left",
        hold: true,
      },
    },
  },
  {
    id: "ball-roll-right",
    name: "Ball Roll (Right)",
    description: "Roll the ball to the right side. Same as Ball Roll but in the opposite direction.",
    starRating: 1,
    category: "basic",
    inputs: {
      rightStick: {
        direction: "right",
        hold: true,
      },
    },
  },
  {
    id: "step-over",
    name: "Step Over",
    description: "A basic feint move where the player steps over the ball, useful for confusing defenders.",
    starRating: 1,
    category: "basic",
    inputs: {
      rightStick: {
        direction: "forward",
        hold: false,
      },
    },
  },
  {
    id: "fake-shot",
    name: "Fake Shot",
    description: "A deceptive move that mimics a shot, useful for creating space or wrong-footing defenders.",
    starRating: 2,
    category: "deception",
    inputs: {
      buttons: ["face-down", "face-right"],
      simultaneous: true,
      timing: "tap",
    },
  },
  {
    id: "stop-and-turn",
    name: "Stop and Turn",
    description: "Quickly stop the ball and turn in a different direction, effective for changing pace.",
    starRating: 2,
    category: "turning",
    inputs: {
      sequence: [
        {
          buttons: ["face-down"],
          timing: "tap",
        },
        {
          leftStick: {
            direction: "backward",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "roulette",
    name: "Roulette",
    description: "A 360-degree spin move that allows the player to turn while maintaining ball control.",
    starRating: 3,
    category: "turning",
    inputs: {
      sequence: [
        {
          rightStick: {
            direction: "forward",
            hold: false,
          },
        },
        {
          rightStick: {
            direction: "forward-right",
            hold: false,
          },
        },
        {
          rightStick: {
            direction: "backward-right",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "lateral-heel-to-heel",
    name: "Lateral Heel to Heel",
    description: "A sharp, reactive move perfect for wingers and wide forwards, allowing instant stops and direction changes to cut inside or create an open shot.",
    starRating: 3,
    category: "advanced",
    inputs: {
      sequence: [
        {
          buttons: ["l1"],
          rightStick: {
            direction: "left",
            hold: false,
          },
          simultaneous: true,
        },
        {
          buttons: ["l1"],
          rightStick: {
            direction: "right",
            hold: false,
          },
          simultaneous: true,
        },
      ],
    },
  },
  {
    id: "heel-to-ball-roll",
    name: "Heel to Ball Roll",
    description: "A high-speed move that lets you glide through defenses while maintaining control, effective when attacking the box diagonally or outpacing defenders one-on-one.",
    starRating: 4,
    category: "advanced",
    inputs: {
      sequence: [
        {
          buttons: ["l1"],
          rightStick: {
            direction: "forward",
            hold: false,
          },
          simultaneous: true,
        },
        {
          buttons: ["l1"],
          rightStick: {
            direction: "backward",
            hold: false,
          },
          simultaneous: true,
        },
      ],
    },
  },
  {
    id: "spin-roulette",
    name: "Spin Roulette",
    description: "A mix of finesse and chaos, the Spin Roulette is perfect for breaking defensive lines or creating space in tight areas.",
    starRating: 4,
    category: "advanced",
    inputs: {
      sequence: [
        {
          buttons: ["l2", "r1"],
          rightStick: {
            direction: "backward",
            hold: false,
          },
          simultaneous: true,
        },
        {
          rightStick: {
            direction: "forward",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "elastico",
    name: "Elastico",
    description: "Creates a smooth, deceptive direction change during tight dribbles, especially effective against aggressive defenders.",
    starRating: 5,
    category: "elite",
    inputs: {
      sequence: [
        {
          buttons: ["l2"],
          rightStick: {
            direction: "forward-right",
            hold: false,
          },
          simultaneous: true,
        },
        {
          rightStick: {
            direction: "forward-left",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "hocus-pocus",
    name: "Hocus Pocus",
    description: "An extremely advanced move that combines multiple skill moves in quick succession, requiring perfect timing and high skill rating.",
    starRating: 5,
    category: "elite",
    inputs: {
      sequence: [
        {
          buttons: ["l1"],
          rightStick: {
            direction: "forward",
            hold: false,
          },
          simultaneous: true,
        },
        {
          rightStick: {
            direction: "backward",
            hold: false,
          },
        },
        {
          rightStick: {
            direction: "forward",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "berba-spin",
    name: "Berba Spin",
    description: "A quick 180-degree turn that allows you to change direction while keeping the ball close, named after Dimitar Berbatov.",
    starRating: 3,
    category: "turning",
    inputs: {
      rightStick: {
        direction: "backward-left",
        hold: false,
      },
      sequence: [
        {
          rightStick: {
            direction: "forward-left",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "mcgeady-spin",
    name: "McGeady Spin",
    description: "A 360-degree spin move that's effective for turning away from defenders in tight spaces.",
    starRating: 4,
    category: "turning",
    inputs: {
      buttons: ["l1"],
      rightStick: {
        direction: "forward",
        hold: false,
      },
      simultaneous: true,
      sequence: [
        {
          rightStick: {
            direction: "backward",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "rainbow-flick",
    name: "Rainbow Flick",
    description: "A flashy move where the player flicks the ball over their head and the defender's head, useful for getting past opponents.",
    starRating: 4,
    category: "advanced",
    inputs: {
      buttons: ["l1"],
      rightStick: {
        direction: "backward",
        hold: false,
      },
      simultaneous: true,
      sequence: [
        {
          rightStick: {
            direction: "forward",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "fake-shot-stop",
    name: "Fake Shot Stop",
    description: "A variation of the fake shot that includes a stop, allowing for a quick change of direction.",
    starRating: 2,
    category: "deception",
    inputs: {
      buttons: ["face-down", "face-right"],
      simultaneous: true,
      timing: "tap",
      sequence: [
        {
          buttons: ["face-down"],
          timing: "tap",
        },
      ],
    },
  },
  {
    id: "drag-back",
    name: "Drag Back",
    description: "Pull the ball back with your foot to create space and change direction quickly.",
    starRating: 2,
    category: "basic",
    inputs: {
      buttons: ["l1"],
      rightStick: {
        direction: "backward",
        hold: true,
      },
      simultaneous: true,
    },
  },
  {
    id: "scoop-turn",
    name: "Scoop Turn",
    description: "A quick turn move that scoops the ball in a new direction, effective for evading defenders.",
    starRating: 3,
    category: "turning",
    inputs: {
      buttons: ["l1"],
      rightStick: {
        direction: "forward-left",
        hold: false,
      },
      simultaneous: true,
      sequence: [
        {
          rightStick: {
            direction: "backward-right",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "ball-roll-cut",
    name: "Ball Roll Cut",
    description: "A combination of a ball roll and a quick cut, useful for creating space in tight areas.",
    starRating: 2,
    category: "basic",
    inputs: {
      rightStick: {
        direction: "left",
        hold: true,
      },
      sequence: [
        {
          rightStick: {
            direction: "forward",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "step-over-exit",
    name: "Step Over Exit",
    description: "A step over followed by an exit in the opposite direction, creating a deceptive change of direction.",
    starRating: 2,
    category: "deception",
    inputs: {
      rightStick: {
        direction: "forward",
        hold: false,
      },
      sequence: [
        {
          rightStick: {
            direction: "left",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "roulette-left",
    name: "Roulette (Left)",
    description: "A 360-degree spin move to the left, allowing the player to turn while maintaining ball control.",
    starRating: 3,
    category: "turning",
    inputs: {
      rightStick: {
        direction: "forward",
        hold: false,
      },
      sequence: [
        {
          rightStick: {
            direction: "forward-left",
            hold: false,
          },
        },
        {
          rightStick: {
            direction: "backward-left",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "rabona-fake",
    name: "Rabona Fake",
    description: "An advanced fake move that mimics a rabona kick, requiring high skill to execute effectively.",
    starRating: 5,
    category: "elite",
    inputs: {
      buttons: ["l1"],
      rightStick: {
        direction: "forward-right",
        hold: false,
      },
      simultaneous: true,
      sequence: [
        {
          rightStick: {
            direction: "backward-left",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "three-touch-roulette",
    name: "Three Touch Roulette",
    description: "An advanced variation of the roulette that involves three touches, creating more space and deception.",
    starRating: 4,
    category: "advanced",
    inputs: {
      buttons: ["l1"],
      rightStick: {
        direction: "forward",
        hold: false,
      },
      simultaneous: true,
      sequence: [
        {
          rightStick: {
            direction: "forward-right",
            hold: false,
          },
        },
        {
          rightStick: {
            direction: "backward-right",
            hold: false,
          },
        },
        {
          rightStick: {
            direction: "backward",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "ball-roll-fake",
    name: "Ball Roll Fake",
    description: "A deceptive move that combines a ball roll with a fake, useful for wrong-footing defenders.",
    starRating: 2,
    category: "deception",
    inputs: {
      rightStick: {
        direction: "left",
        hold: true,
      },
      sequence: [
        {
          rightStick: {
            direction: "forward",
            hold: false,
          },
        },
      ],
    },
  },
  {
    id: "advanced-roulette",
    name: "Advanced Roulette",
    description: "A more complex version of the roulette that requires precise timing and higher skill rating.",
    starRating: 4,
    category: "advanced",
    inputs: {
      buttons: ["l2"],
      rightStick: {
        direction: "forward",
        hold: false,
      },
      simultaneous: true,
      sequence: [
        {
          rightStick: {
            direction: "forward-right",
            hold: false,
          },
        },
        {
          rightStick: {
            direction: "backward-right",
            hold: false,
          },
        },
        {
          rightStick: {
            direction: "backward",
            hold: false,
          },
        },
      ],
    },
  },
];

export function getSkillMovesByRating(rating: number): SkillMove[] {
  return skillMoves.filter((move) => move.starRating <= rating);
}

export function getSkillMoveById(id: string): SkillMove | undefined {
  return skillMoves.find((move) => move.id === id);
}

export function searchSkillMoves(query: string): SkillMove[] {
  const lowerQuery = query.toLowerCase();
  return skillMoves.filter(
    (move) =>
      move.name.toLowerCase().includes(lowerQuery) ||
      move.description.toLowerCase().includes(lowerQuery) ||
      move.category?.toLowerCase().includes(lowerQuery)
  );
}
