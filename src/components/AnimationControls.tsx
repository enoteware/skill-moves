"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimationControlsProps {
  isPlaying: boolean;
  isLooping: boolean;
  speed: number;
  onPlayPause: () => void;
  onLoopToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  className?: string;
}

export function AnimationControls({
  isPlaying,
  isLooping,
  speed,
  onPlayPause,
  onLoopToggle,
  onSpeedChange,
  onReset,
  className,
}: AnimationControlsProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50",
        "px-4 py-3 safe-area-inset-bottom",
        className
      )}
    >
      <div className="max-w-md mx-auto space-y-3">
        {/* Main Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="h-12 w-12 rounded-full"
            aria-label="Reset animation"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={onPlayPause}
            size="lg"
            className="h-12 px-8 rounded-full flex-1 max-w-[200px]"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Play
              </>
            )}
          </Button>

          <div className="relative inline-block">
            <Button
              variant={isLooping ? "default" : "outline"}
              size="icon"
              onClick={onLoopToggle}
              className="h-12 w-12 rounded-full relative z-10"
              aria-label={isLooping ? "Disable loop" : "Enable loop"}
            >
              <Repeat className={cn("h-5 w-5", isLooping && "fill-current")} />
            </Button>
            {isLooping && (
              <svg
                className="absolute inset-0 pointer-events-none"
                viewBox="0 0 48 48"
                width="48"
                height="48"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="23"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Speed Slider */}
        <div className="space-y-2 bg-muted/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Animation Speed</span>
            <span className="text-lg font-bold text-primary">{speed.toFixed(1)}x</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={([value]) => onSpeedChange(value)}
            min={0.5}
            max={2.0}
            step={0.1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>0.5x</span>
            <span>1.0x</span>
            <span>2.0x</span>
          </div>
        </div>
      </div>
    </div>
  );
}
