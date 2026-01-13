"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Platform, ButtonType, InputDirection } from "@/types/skillMove";
import { Controller } from "@/components/Controller";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Square } from "lucide-react";

// Constants defined outside component to avoid recreation on every render
const ALL_BUTTONS: ButtonType[] = [
  "face-up",
  "face-down",
  "face-left",
  "face-right",
  "l1",
  "l2",
  "r1",
  "r2",
  "left-stick",
  "right-stick",
];

const ALL_DIRECTIONS: InputDirection[] = [
  "forward",
  "forward-right",
  "right",
  "backward-right",
  "backward",
  "backward-left",
  "left",
  "forward-left",
];

export default function DebugPage() {
  const [platform, setPlatform] = useState<Platform>("playstation");
  const [activeButtons, setActiveButtons] = useState<ButtonType[]>([]);
  const [leftStickDirection, setLeftStickDirection] = useState<InputDirection | null>(null);
  const [rightStickDirection, setRightStickDirection] = useState<InputDirection | null>(null);
  const [playerDirection, setPlayerDirection] = useState<"N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW">("N");
  
  // Loop test state
  const [isLoopTestRunning, setIsLoopTestRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [currentTestType, setCurrentTestType] = useState<"button" | "left-stick" | "right-stick" | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleButton = (button: ButtonType) => {
    setActiveButtons((prev) =>
      prev.includes(button) ? prev.filter((b) => b !== button) : [...prev, button]
    );
  };

  const toggleStick = (stick: "left" | "right", direction: InputDirection) => {
    if (stick === "left") {
      setLeftStickDirection(leftStickDirection === direction ? null : direction);
    } else {
      setRightStickDirection(rightStickDirection === direction ? null : direction);
    }
  };

  const clearAll = () => {
    setActiveButtons([]);
    setLeftStickDirection(null);
    setRightStickDirection(null);
  };

  // Create test sequence: all buttons, then all left stick directions, then all right stick directions
  // Memoize to avoid recreating on every render
  const testSequence = useMemo(
    () => [
      ...ALL_BUTTONS.map((btn) => ({ type: "button" as const, value: btn })),
      ...ALL_DIRECTIONS.map((dir) => ({ type: "left-stick" as const, value: dir })),
      ...ALL_DIRECTIONS.map((dir) => ({ type: "right-stick" as const, value: dir })),
    ],
    []
  );

  const totalTests = testSequence.length;

  // Loop test logic
  useEffect(() => {
    if (isLoopTestRunning) {
      intervalRef.current = setInterval(() => {
        setCurrentTestIndex((prev) => {
          const nextIndex = (prev + 1) % totalTests;
          const test = testSequence[nextIndex];
          
          // Clear previous inputs
          setActiveButtons([]);
          setLeftStickDirection(null);
          setRightStickDirection(null);
          
          // Set new input based on test type
          if (test.type === "button") {
            setActiveButtons([test.value]);
            setCurrentTestType("button");
          } else if (test.type === "left-stick") {
            setLeftStickDirection(test.value);
            setCurrentTestType("left-stick");
          } else if (test.type === "right-stick") {
            setRightStickDirection(test.value);
            setCurrentTestType("right-stick");
          }
          
          return nextIndex;
        });
      }, 1000); // Change every 1 second
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [isLoopTestRunning, totalTests, testSequence]);

  const startLoopTest = () => {
    setCurrentTestIndex(0);
    setIsLoopTestRunning(true);
    // Start with first test immediately
    const firstTest = testSequence[0];
    clearAll();
    if (firstTest.type === "button") {
      setActiveButtons([firstTest.value]);
      setCurrentTestType("button");
    } else if (firstTest.type === "left-stick") {
      setLeftStickDirection(firstTest.value);
      setCurrentTestType("left-stick");
    } else if (firstTest.type === "right-stick") {
      setRightStickDirection(firstTest.value);
      setCurrentTestType("right-stick");
    }
  };

  const stopLoopTest = () => {
    setIsLoopTestRunning(false);
    setCurrentTestIndex(0);
    setCurrentTestType(null);
    clearAll();
  };

  // Create mock input for Controller component
  const mockInput = {
    buttons: activeButtons.length > 0 ? activeButtons : undefined,
    leftStick: leftStickDirection
      ? {
          direction: leftStickDirection,
          hold: true,
        }
      : undefined,
    rightStick: rightStickDirection
      ? {
          direction: rightStickDirection,
          hold: true,
        }
      : undefined,
  };

  // Calculate stick positions for display
  const getStickPosition = (direction: InputDirection) => {
    const directionAngles: Record<InputDirection, number> = {
      forward: 0,
      "forward-right": 45,
      right: 90,
      "backward-right": 135,
      backward: 180,
      "backward-left": 225,
      left: 270,
      "forward-left": 315,
    };

    const playerAngles: Record<typeof playerDirection, number> = {
      N: 0,
      NE: 45,
      E: 90,
      SE: 135,
      S: 180,
      SW: 225,
      W: 270,
      NW: 315,
    };

    const relativeAngle = directionAngles[direction];
    const playerAngle = playerAngles[playerDirection];
    const absoluteAngle = (playerAngle + relativeAngle) % 360;
    const radians = (absoluteAngle * Math.PI) / 180;
    const x = Math.sin(radians);
    const y = -Math.cos(radians);
    return {
      x: (x + 1) / 2,
      y: (y + 1) / 2,
    };
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-32">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Controller Debug Page</h1>
          <p className="text-muted-foreground">
            Test all controller inputs and verify SVG coordinate mappings
          </p>
        </div>

        {/* Platform Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={platform === "playstation" ? "default" : "outline"}
                onClick={() => setPlatform("playstation")}
              >
                PlayStation
              </Button>
              <Button
                variant={platform === "xbox" ? "default" : "outline"}
                onClick={() => setPlatform("xbox")}
              >
                Xbox
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controllers Display */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Controller Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                input={mockInput}
                platform={platform}
                playerDirection={playerDirection}
                activeButtons={activeButtons}
                activeLeftStick={
                  leftStickDirection ? getStickPosition(leftStickDirection) : null
                }
                activeRightStick={
                  rightStickDirection ? getStickPosition(rightStickDirection) : null
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Player Direction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {(["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const).map((dir) => (
                  <Button
                    key={dir}
                    variant={playerDirection === dir ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPlayerDirection(dir)}
                  >
                    {dir}
                  </Button>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Current: <Badge>{playerDirection}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loop Test Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Loop Test - Verify All Inputs Animate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {!isLoopTestRunning ? (
                <Button onClick={startLoopTest} className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Loop Test
                </Button>
              ) : (
                <Button onClick={stopLoopTest} variant="destructive" className="gap-2">
                  <Square className="h-4 w-4" />
                  Stop Test
                </Button>
              )}
              {isLoopTestRunning && (
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Testing: {currentTestType && testSequence[currentTestIndex] ? (
                        <Badge variant="outline">
                          {currentTestType === "button" 
                            ? `Button: ${testSequence[currentTestIndex].value.replace("-", " ")}`
                            : `${currentTestType === "left-stick" ? "Left" : "Right"} Stick: ${testSequence[currentTestIndex].value.replace("-", " ")}`
                          }
                        </Badge>
                      ) : "Starting..."}
                    </span>
                    <span className="text-muted-foreground">
                      {currentTestIndex + 1} / {totalTests}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentTestIndex + 1) / totalTests) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            {!isLoopTestRunning && (
              <p className="text-sm text-muted-foreground">
                Automatically cycles through all {totalTests} inputs (10 buttons + 8 left stick directions + 8 right stick directions) to verify they animate correctly.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Controls */}
        <Tabs defaultValue="buttons" className="w-full">
          <TabsList>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="left-stick">Left Stick</TabsTrigger>
            <TabsTrigger value="right-stick">Right Stick</TabsTrigger>
            <TabsTrigger value="coordinates">Coordinates</TabsTrigger>
          </TabsList>

          <TabsContent value="buttons" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Face Buttons & Triggers</CardTitle>
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {ALL_BUTTONS.map((button) => (
                    <Button
                      key={button}
                      variant={activeButtons.includes(button) ? "default" : "outline"}
                      onClick={() => toggleButton(button)}
                      className="text-xs"
                    >
                      {button.replace("-", " ")}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Active: {activeButtons.length > 0 ? activeButtons.join(", ") : "None"}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="left-stick" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Left Stick Directions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {ALL_DIRECTIONS.map((direction) => {
                    const isActive = leftStickDirection === direction;
                    const pos = isActive ? getStickPosition(direction) : null;
                    return (
                      <div key={direction} className="space-y-1">
                        <Button
                          variant={isActive ? "default" : "outline"}
                          onClick={() => toggleStick("left", direction)}
                          className="w-full text-xs"
                        >
                          {direction.replace("-", " ")}
                        </Button>
                        {isActive && pos && (
                          <div className="text-xs text-muted-foreground text-center">
                            ({pos.x.toFixed(2)}, {pos.y.toFixed(2)})
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {leftStickDirection && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="text-sm font-semibold mb-2">Position Details:</div>
                    <div className="text-xs space-y-1 font-mono">
                      <div>Direction: {leftStickDirection}</div>
                      <div>Player Facing: {playerDirection}</div>
                      <div>
                        Coordinates: ({getStickPosition(leftStickDirection).x.toFixed(3)},{" "}
                        {getStickPosition(leftStickDirection).y.toFixed(3)})
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="right-stick" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Right Stick Directions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {ALL_DIRECTIONS.map((direction) => {
                    const isActive = rightStickDirection === direction;
                    const pos = isActive ? getStickPosition(direction) : null;
                    return (
                      <div key={direction} className="space-y-1">
                        <Button
                          variant={isActive ? "default" : "outline"}
                          onClick={() => toggleStick("right", direction)}
                          className="w-full text-xs"
                        >
                          {direction.replace("-", " ")}
                        </Button>
                        {isActive && pos && (
                          <div className="text-xs text-muted-foreground text-center">
                            ({pos.x.toFixed(2)}, {pos.y.toFixed(2)})
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {rightStickDirection && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="text-sm font-semibold mb-2">Position Details:</div>
                    <div className="text-xs space-y-1 font-mono">
                      <div>Direction: {rightStickDirection}</div>
                      <div>Player Facing: {playerDirection}</div>
                      <div>
                        Coordinates: ({getStickPosition(rightStickDirection).x.toFixed(3)},{" "}
                        {getStickPosition(rightStickDirection).y.toFixed(3)})
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coordinates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SVG Coordinate Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">
                      {platform === "playstation" ? "PS5 Controller" : "Xbox Controller"}
                    </h3>
                    <div className="text-sm space-y-2 font-mono bg-muted p-4 rounded-lg">
                      {platform === "playstation" ? (
                        <>
                          <div>ViewBox: 0 0 580 360</div>
                          <div>Face Up (△): (464.23, 69.89)</div>
                          <div>Face Right (○): (501.34, 107)</div>
                          <div>Face Down (✕): (464.12, 144.11)</div>
                          <div>Face Left (□): (427.07, 107.06)</div>
                          <div>Left Stick: (209.4, 176.33, radius: 20)</div>
                          <div>Right Stick: (370.78, 176.33, radius: 20)</div>
                          <div>L1: (135, 50)</div>
                          <div>L2: (135, 30)</div>
                          <div>R1: (445, 50)</div>
                          <div>R2: (445, 30)</div>
                        </>
                      ) : (
                        <>
                          <div>ViewBox: 0 0 500 500</div>
                          <div>Face Up (Y): (323, 191.5)</div>
                          <div>Face Right (B): (352.9, 211.6)</div>
                          <div>Face Down (A): (323, 231.8)</div>
                          <div>Face Left (X): (293, 211.7)</div>
                          <div>Left Stick: (177, 211.6, radius: 22)</div>
                          <div>Right Stick: (289, 256.2, radius: 22)</div>
                          <div>LB: (177, 180)</div>
                          <div>LT: (177, 160)</div>
                          <div>RB: (289, 220)</div>
                          <div>RT: (289, 200)</div>
                        </>
                      )}
                    </div>
                  </div>
                  {activeButtons.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Active Buttons</h3>
                      <div className="text-sm space-y-1">
                        {activeButtons.map((button) => (
                          <div key={button} className="font-mono">
                            {button}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {(leftStickDirection || rightStickDirection) && (
                    <div>
                      <h3 className="font-semibold mb-2">Active Sticks</h3>
                      <div className="text-sm space-y-1 font-mono">
                        {leftStickDirection && (
                          <div>
                            Left: {leftStickDirection} → ({getStickPosition(leftStickDirection).x.toFixed(3)},{" "}
                            {getStickPosition(leftStickDirection).y.toFixed(3)})
                          </div>
                        )}
                        {rightStickDirection && (
                          <div>
                            Right: {rightStickDirection} → ({getStickPosition(rightStickDirection).x.toFixed(3)},{" "}
                            {getStickPosition(rightStickDirection).y.toFixed(3)})
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
