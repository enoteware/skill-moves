"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSkillMoveById } from "@/lib/skillMoves";
import { Platform } from "@/types/skillMove";
import { AnimatedController, AnimatedControllerRef } from "@/components/AnimatedController";
import { AnimationControls } from "@/components/AnimationControls";
import { DirectionSelector } from "@/components/DirectionSelector";
import { PracticeMode } from "@/components/PracticeMode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronDown, ChevronUp, Play, Gamepad2 } from "lucide-react";
import { angleToDirection } from "@/lib/controller";

export default function SkillMoveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const moveId = params.id as string;

  // Load platform preference from localStorage after mount to avoid hydration mismatch
  const [platform] = useState<Platform>(() => {
    if (typeof window !== "undefined") {
      const savedPlatform = localStorage.getItem("skill-moves-platform") as Platform | null;
      if (savedPlatform === "playstation" || savedPlatform === "xbox") {
        return savedPlatform;
      }
    }
    return "playstation";
  });
  const [playerAngle, setPlayerAngle] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [isLooping, setIsLooping] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDirectionSelector, setShowDirectionSelector] = useState(false);
  const [mode, setMode] = useState<"watch" | "practice">("watch");
  const controllerRef = useRef<AnimatedControllerRef>(null);

  const move = getSkillMoveById(moveId);
  const playerDirection = angleToDirection(playerAngle);

  if (!move) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Skill Move Not Found</h1>
          <p className="text-muted-foreground mb-4">The skill move you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push("/")}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="h-9 w-9"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold truncate">{move.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {move.starRating}★
                </Badge>
                {move.category && (
                  <Badge variant="outline" className="text-xs">
                    {move.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{move.description}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-6">
        {/* Mode Toggle */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as "watch" | "practice")} className="w-full max-w-lg mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="watch" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Watch
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Practice
            </TabsTrigger>
          </TabsList>

          <TabsContent value="watch" className="mt-6">
            {/* Controller - Large and centered */}
            <div className="w-full mb-6">
              <AnimatedController
                ref={controllerRef}
                input={move.inputs}
                platform={platform}
                playerDirection={playerDirection}
                speed={speed}
                loop={isLooping}
                isPlaying={isPlaying}
                onPlayStateChange={setIsPlaying}
              />
            </div>

            {/* Collapsible Settings */}
            <div className="w-full space-y-3">
              {/* Direction Selector - Collapsible */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowDirectionSelector(!showDirectionSelector)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium">Player Direction: {playerDirection}</span>
                  {showDirectionSelector ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {showDirectionSelector && (
                  <div className="px-3 pb-3 border-t border-border pt-3">
                    <DirectionSelector angle={playerAngle} onAngleChange={setPlayerAngle} />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="practice" className="mt-6">
            <PracticeMode
              skillMove={move}
              platform={platform}
              playerDirection={playerDirection}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Animation Controls - Fixed at bottom (only show in watch mode) */}
      {mode === "watch" && (
        <AnimationControls
          isPlaying={isPlaying}
          isLooping={isLooping}
          speed={speed}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onLoopToggle={() => setIsLooping(!isLooping)}
          onSpeedChange={setSpeed}
          onReset={() => {
            controllerRef.current?.reset();
            setIsPlaying(false);
          }}
        />
      )}
    </div>
  );
}
