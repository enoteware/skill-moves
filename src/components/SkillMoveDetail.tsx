"use client";

import { SkillMove } from "@/types/skillMove";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Controller } from "./Controller";
import { DirectionSelector } from "./DirectionSelector";
import { Platform, PlayerDirection } from "@/types/skillMove";
import { angleToDirection } from "@/lib/controller";

interface SkillMoveDetailProps {
  move: SkillMove;
  platform: Platform;
  playerAngle: number;
  onAngleChange: (angle: number) => void;
}

export function SkillMoveDetail({
  move,
  platform,
  playerAngle,
  onAngleChange,
}: SkillMoveDetailProps) {
  const playerDirection = angleToDirection(playerAngle);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{move.name}</CardTitle>
              <CardDescription className="text-base">{move.description}</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {move.starRating}★
            </Badge>
          </div>
          {move.category && (
            <Badge variant="outline" className="mt-2">
              {move.category}
            </Badge>
          )}
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Controller Input</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              input={move.inputs}
              platform={platform}
              playerDirection={playerDirection}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Player Direction</CardTitle>
          </CardHeader>
          <CardContent>
            <DirectionSelector angle={playerAngle} onAngleChange={onAngleChange} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
