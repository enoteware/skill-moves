"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { skillMoves, searchSkillMoves } from "@/lib/skillMoves";
import { SkillMoveCard } from "@/components/SkillMoveCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    skillMoves.forEach((move) => {
      if (move.category) {
        cats.add(move.category);
      }
    });
    return Array.from(cats).sort();
  }, []);

  // Filter skill moves
  const filteredMoves = useMemo(() => {
    let moves = skillMoves;

    // Search filter
    if (searchQuery.trim()) {
      moves = searchSkillMoves(searchQuery);
    }

    // Rating filter
    if (selectedRating !== "all") {
      const rating = parseInt(selectedRating);
      moves = moves.filter((move) => move.starRating === rating);
    }

    // Category filter
    if (selectedCategory !== "all") {
      moves = moves.filter((move) => move.category === selectedCategory);
    }

    return moves;
  }, [searchQuery, selectedRating, selectedCategory]);

  const handleMoveClick = (moveId: string) => {
    router.push(`/move/${moveId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Filters */}
      <div className="sticky top-[73px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search skill moves..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 gap-2">
          <Select value={selectedRating} onValueChange={setSelectedRating}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="1">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  <span>1 Star</span>
                </div>
              </SelectItem>
              <SelectItem value="2">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <span>2 Stars</span>
                </div>
              </SelectItem>
              <SelectItem value="3">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <span>3 Stars</span>
                </div>
              </SelectItem>
              <SelectItem value="4">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <span>4 Stars</span>
                </div>
              </SelectItem>
              <SelectItem value="5">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <span>5 Stars</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Skill Moves List */}
      <main className="px-4 py-4">
        <div className="mb-2 text-sm text-muted-foreground">
          {filteredMoves.length} {filteredMoves.length === 1 ? "move" : "moves"} found
        </div>
        <div className="grid gap-3">
          {filteredMoves.map((move) => (
            <SkillMoveCard
              key={move.id}
              move={move}
              isSelected={false}
              onClick={() => handleMoveClick(move.id)}
            />
          ))}
        </div>
        {filteredMoves.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No skill moves found</p>
            <p className="text-sm">Try adjusting your filters or search query</p>
          </div>
        )}
      </main>
    </div>
  );
}
