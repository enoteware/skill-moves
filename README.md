# EAFC Skill Moves Learning App

An interactive single-page application built with Next.js to help players learn and master skill moves in EA Sports FC (EAFC). The app features an interactive controller visualization that adapts based on player facing direction, comprehensive skill moves database, and support for both PlayStation and Xbox controllers.

## Features

- **Interactive Controller Visualization**: See exactly which buttons and stick movements are needed for each skill move
- **Dynamic Input Translation**: Controller inputs automatically adjust based on the player's facing direction (0-360°)
- **Comprehensive Database**: 25+ skill moves across all star ratings (1-5 stars)
- **Platform Support**: Switch between PlayStation and Xbox button layouts
- **Search & Filter**: Find moves by name or filter by star rating requirement
- **Visual Direction Selector**: Adjust player facing angle with a slider or use 8 cardinal direction presets
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Next.js 16.1.1** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible component library
- **React 19** - Latest React features

## Getting Started

### Prerequisites

- Node.js 20.9 or higher
- npm, pnpm, yarn, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd skill-moves
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
skill-moves/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Controller.tsx
│   │   ├── DirectionSelector.tsx
│   │   ├── PlatformToggle.tsx
│   │   ├── SkillMoveCard.tsx
│   │   └── SkillMoveDetail.tsx
│   ├── lib/              # Utility functions and data
│   │   ├── skillMoves.ts  # Skill moves database
│   │   ├── controller.ts  # Input conversion logic
│   │   └── utils.ts      # General utilities
│   └── types/            # TypeScript type definitions
└── public/               # Static assets
```

## How It Works

1. **Select a Skill Move**: Browse the list of skill moves on the left sidebar
2. **View Controller Inputs**: See the required button presses and stick movements
3. **Adjust Player Direction**: Use the direction selector to see how inputs change based on facing angle
4. **Switch Platforms**: Toggle between PlayStation and Xbox button layouts
5. **Filter & Search**: Find specific moves by name or star rating

## Skill Moves Database

The app includes skill moves across all star ratings:

- **1 Star**: Basic moves like Ball Roll, Step Over
- **2 Star**: Fake Shot, Stop and Turn, Drag Back
- **3 Star**: Roulette, Lateral Heel to Heel, Berba Spin
- **4 Star**: Heel to Ball Roll, Spin Roulette, McGeady Spin, Rainbow Flick
- **5 Star**: Elastico, Hocus Pocus, Rabona Fake

Each move includes:
- Name and description
- Star rating requirement
- Controller input sequence
- Platform-specific button mappings

## Future Enhancements

- GIF/MP4 animation integration showing moves in action
- Animation sync with button inputs
- Practice mode (user inputs matched against sequence)
- Favorites/bookmarks
- Share functionality

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
