"use client";

import { useState, useMemo } from "react";
import { SkillMove, Platform } from "@/types/skillMove";
import { skillMoves, searchSkillMoves } from "@/lib/skillMoves";
import { SkillMoveCard } from "@/components/SkillMoveCard";
import { SkillMoveDetail } from "@/components/SkillMoveDetail";
import { PlatformToggle } from "@/components/PlatformToggle";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [selectedMove, setSelectedMove] = useState<SkillMove | null>(skillMoves[0] || null);
  const [platform, setPlatform] = useState<Platform>("playstation");
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState<string>("all");
  const [playerAngle, setPlayerAngle] = useState(0);

  // Filter and search moves
  const filteredMoves = useMemo(() => {
    let moves = skillMoves;

    // Apply star rating filter
    if (starFilter !== "all") {
      const rating = parseInt(starFilter);
      moves = moves.filter((move) => move.starRating === rating);
    }

    // Apply search query
    if (searchQuery.trim()) {
      moves = searchSkillMoves(searchQuery);
      // Also apply star filter to search results
      if (starFilter !== "all") {
        const rating = parseInt(starFilter);
        moves = moves.filter((move) => move.starRating === rating);
      }
    }

    return moves;
  }, [searchQuery, starFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">EAFC Skill Moves</h1>
            <PlatformToggle platform={platform} onPlatformChange={setPlatform} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Move List */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                {/* Search */}
                <Input
                  placeholder="Search skill moves..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Star Rating Filter */}
                <Select value={starFilter} onValueChange={setStarFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by star rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>

                {/* Results count */}
                <div className="text-sm text-muted-foreground">
                  {filteredMoves.length} move{filteredMoves.length !== 1 ? "s" : ""} found
                </div>
              </div>
            </Card>

            {/* Move List */}
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredMoves.length === 0 ? (
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    No skill moves found. Try adjusting your filters.
                  </p>
                </Card>
              ) : (
                filteredMoves.map((move) => (
                  <SkillMoveCard
                    key={move.id}
                    move={move}
                    isSelected={selectedMove?.id === move.id}
                    onClick={() => setSelectedMove(move)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Main Content - Move Detail */}
          <div className="lg:col-span-2">
            {selectedMove ? (
              <SkillMoveDetail
                move={selectedMove}
                platform={platform}
                playerAngle={playerAngle}
                onAngleChange={setPlayerAngle}
              />
            ) : (
              <Card className="p-8">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg">Select a skill move to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
