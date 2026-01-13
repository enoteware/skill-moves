"use client";

import { Platform } from "@/types/skillMove";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlatformToggleProps {
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;
  className?: string;
}

export function PlatformToggle({ platform, onPlatformChange, className }: PlatformToggleProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        variant={platform === "playstation" ? "default" : "outline"}
        onClick={() => onPlatformChange("playstation")}
        className="flex-1"
      >
        PlayStation
      </Button>
      <Button
        variant={platform === "xbox" ? "default" : "outline"}
        onClick={() => onPlatformChange("xbox")}
        className="flex-1"
      >
        Xbox
      </Button>
    </div>
  );
}
