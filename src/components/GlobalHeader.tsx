"use client";

import { useState } from "react";
import { Platform } from "@/types/skillMove";
import { PlatformToggle } from "./PlatformToggle";

export function GlobalHeader() {
  const [platform, setPlatform] = useState<Platform>(() => {
    if (typeof window !== "undefined") {
      const savedPlatform = localStorage.getItem("skill-moves-platform") as Platform | null;
      if (savedPlatform === "playstation" || savedPlatform === "xbox") {
        return savedPlatform;
      }
    }
    return "playstation";
  });

  // Save platform preference
  const handlePlatformChange = (newPlatform: Platform) => {
    setPlatform(newPlatform);
    localStorage.setItem("skill-moves-platform", newPlatform);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Skill Moves</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Learn and practice FIFA skill moves
            </p>
          </div>
          <div className="flex-shrink-0">
            <PlatformToggle platform={platform} onPlatformChange={handlePlatformChange} />
          </div>
        </div>
      </div>
    </header>
  );
}
