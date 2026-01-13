"use client";

import { SkillMove } from "@/types/skillMove";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SkillMoveCardProps {
  move: SkillMove;
  isSelected: boolean;
  onClick: () => void;
}

export function SkillMoveCard({ move, isSelected, onClick }: SkillMoveCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{move.name}</CardTitle>
          <Badge variant="secondary" className="ml-2">
            {move.starRating}★
          </Badge>
        </div>
        {move.category && (
          <CardDescription className="text-xs text-muted-foreground">
            {move.category}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{move.description}</p>
      </CardContent>
    </Card>
  );
}
