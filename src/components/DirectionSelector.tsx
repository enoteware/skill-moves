"use client";

import { PlayerDirection } from "@/types/skillMove";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { angleToDirection } from "@/lib/controller";
import { DirectionArrow } from "./DirectionArrow";
import { cn } from "@/lib/utils";

interface DirectionSelectorProps {
  angle: number;
  onAngleChange: (angle: number) => void;
  className?: string;
}

const directionPresets: { label: string; angle: number; direction: PlayerDirection }[] = [
  { label: "N", angle: 0, direction: "N" },
  { label: "NE", angle: 45, direction: "NE" },
  { label: "E", angle: 90, direction: "E" },
  { label: "SE", angle: 135, direction: "SE" },
  { label: "S", angle: 180, direction: "S" },
  { label: "SW", angle: 225, direction: "SW" },
  { label: "W", angle: 270, direction: "W" },
  { label: "NW", angle: 315, direction: "NW" },
];

export function DirectionSelector({ angle, onAngleChange, className }: DirectionSelectorProps) {
  const currentDirection = angleToDirection(angle);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center">
        <div className="text-2xl font-bold mb-1">{angle}°</div>
        <div className="text-sm text-muted-foreground">
          Facing: <span className="font-semibold"><DirectionArrow direction={currentDirection} showText={false} /> {currentDirection}</span>
        </div>
      </div>

      {/* Visual Direction Indicator */}
      <div className="relative w-32 h-32 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Circle */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
          
          {/* Direction lines */}
          {directionPresets.map((preset) => {
            const radians = (preset.angle * Math.PI) / 180;
            const x1 = 50;
            const y1 = 50;
            const x2 = 50 + 40 * Math.sin(radians);
            const y2 = 50 - 40 * Math.cos(radians);
            const isActive = preset.direction === currentDirection;
            
            return (
              <line
                key={preset.direction}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                strokeWidth={isActive ? 3 : 1}
              />
            );
          })}
          
          {/* Player indicator (arrow) */}
          <g transform={`rotate(${angle} 50 50)`}>
            <polygon
              points="50,10 45,25 55,25"
              fill="hsl(var(--primary))"
            />
          </g>
        </svg>
      </div>

      {/* Angle Slider */}
      <div className="px-4">
        <Slider
          value={[angle]}
          onValueChange={([value]) => onAngleChange(value)}
          min={0}
          max={360}
          step={1}
          className="w-full"
        />
      </div>

      {/* Direction Presets */}
      <div className="grid grid-cols-4 gap-2">
        {directionPresets.map((preset) => (
          <Button
            key={preset.direction}
            variant={currentDirection === preset.direction ? "default" : "outline"}
            size="sm"
            onClick={() => onAngleChange(preset.angle)}
            className="text-xs"
          >
            <DirectionArrow direction={preset.direction} showText={false} /> {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
