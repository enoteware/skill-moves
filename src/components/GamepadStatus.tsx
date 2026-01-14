"use client";

import React from "react";
import { Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Platform } from "@/types/skillMove";

interface GamepadStatusProps {
  connected: boolean;
  controllerType: Platform | null;
  controllerName: string | null;
  className?: string;
}

export function GamepadStatus({
  connected,
  controllerType,
  controllerName,
  className,
}: GamepadStatusProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
        connected
          ? "bg-green-500/10 text-green-600 dark:text-green-400"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      <Gamepad2
        className={cn(
          "w-4 h-4",
          connected && "animate-pulse"
        )}
      />
      {connected ? (
        <div className="flex flex-col">
          <span className="font-medium">
            {controllerType === "playstation" ? "PlayStation" : "Xbox"} Connected
          </span>
          {controllerName && (
            <span className="text-xs opacity-70 truncate max-w-[200px]">
              {controllerName}
            </span>
          )}
        </div>
      ) : (
        <span>Connect a controller to practice</span>
      )}
    </div>
  );
}
