"use client";

import {
  ClockIcon,
  Code2Icon,
  FileTextIcon,
  InfoIcon,
  ZapIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { DiffViewer } from "~/components/diffing";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { Toggle } from "~/components/ui/toggle";
import { type DiffAlgorithm, algorithms, lcsAlgorithm } from "~/lib/algorithms";

const EXAMPLE_TEXTS = {
  simple: {
    old: "This is a simple example.\nIt has a few lines.\nSome lines will be changed.\nOthers will remain the same.\nAnd some will be deleted.",
    new: "This is a simple example.\nIt has a few lines.\nSome lines have been modified.\nOthers will remain the same.\nAnd some new lines will be added.\nLike this one.",
  },
  code: {
    old: `function calculateSum(a, b) {
  return a + b;
}

function calculateProduct(a, b) {
  return a * b;
}

// This function will be deleted
function calculateDifference(a, b) {
  return a - b;
}

console.log("The sum is:", calculateSum(5, 3));
console.log("The product is:", calculateProduct(5, 3));
console.log("The difference is:", calculateDifference(5, 3));`,
    new: `function calculateSum(a, b) {
  // Add two numbers
  return a + b;
}

// This function has been moved
function calculateDifference(a, b) {
  return a - b;
}

function calculateProduct(a, b) {
  // Multiply two numbers
  return a * b;
}

// This function has been added
function calculateQuotient(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

console.log("The sum is:", calculateSum(5, 3));
console.log("The product is:", calculateProduct(5, 3));
console.log("The difference is:", calculateDifference(5, 3));
console.log("The quotient is:", calculateQuotient(5, 3));`,
  },
};

export default function HomePage() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [realTimeDiff, setRealTimeDiff] = useState(true);
  const [debouncedOldText, setDebouncedOldText] = useState("");
  const [debouncedNewText, setDebouncedNewText] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<DiffAlgorithm>(lcsAlgorithm);
  const [viewMode, setViewMode] = useState<"side-by-side" | "unified">(
    "side-by-side",
  );
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [userSelectedViewMode, setUserSelectedViewMode] = useState<
    "side-by-side" | "unified"
  >("side-by-side");

  useEffect(() => {
    setOldText(EXAMPLE_TEXTS.code.old);
    setNewText(EXAMPLE_TEXTS.code.new);
    setDebouncedOldText(EXAMPLE_TEXTS.code.old);
    setDebouncedNewText(EXAMPLE_TEXTS.code.new);
  }, []);

  useEffect(() => {
    if (!realTimeDiff) return;

    const timeoutId = setTimeout(() => {
      setDebouncedOldText(oldText);
      setDebouncedNewText(newText);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [oldText, newText, realTimeDiff]);

  useEffect(() => {
    const checkScreenSize = () => {
      const isSmallScreen = window.innerWidth < 768;
      setIsMobileView(isSmallScreen);

      if (isSmallScreen) {
        setViewMode("unified");
      } else {
        setViewMode(userSelectedViewMode);
      }
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, [userSelectedViewMode]);

  const handleViewModeChange = (mode: "side-by-side" | "unified") => {
    setUserSelectedViewMode(mode);

    if (!isMobileView) {
      setViewMode(mode);
    }
  };

  const handleExampleChange = (example: keyof typeof EXAMPLE_TEXTS) => {
    setOldText(EXAMPLE_TEXTS[example].old);
    setNewText(EXAMPLE_TEXTS[example].new);
    setDebouncedOldText(EXAMPLE_TEXTS[example].old);
    setDebouncedNewText(EXAMPLE_TEXTS[example].new);
  };

  const handleManualDiff = () => {
    setDebouncedOldText(oldText);
    setDebouncedNewText(newText);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">Diffing Tool</CardTitle>
          <CardDescription>
            Compare text and code with multiple diffing algorithms
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`grid grid-cols-1 ${
              isMobileView ? "md:grid-cols-2" : "md:grid-cols-3"
            } gap-6`}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Algorithm</label>
              <Select
                value={selectedAlgorithm.name}
                onValueChange={(value) => {
                  const selected = algorithms.find((alg) => alg.name === value);
                  if (selected) setSelectedAlgorithm(selected);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  {algorithms.map((algorithm) => (
                    <SelectItem key={algorithm.name} value={algorithm.name}>
                      {algorithm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isMobileView && (
              <div className="space-y-2">
                <label className="text-sm font-medium">View Mode</label>
                <Tabs
                  defaultValue={userSelectedViewMode}
                  value={userSelectedViewMode}
                  onValueChange={(value) =>
                    handleViewModeChange(value as "side-by-side" | "unified")
                  }
                  className="w-full"
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="side-by-side" className="flex-1">
                      Side by Side
                    </TabsTrigger>
                    <TabsTrigger value="unified" className="flex-1">
                      Unified
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Options</label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Real-time Diffing
                  </span>
                  <Toggle
                    pressed={realTimeDiff}
                    onPressedChange={setRealTimeDiff}
                    aria-label="Toggle real-time diffing"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Line Numbers</span>
                  <Toggle
                    pressed={showLineNumbers}
                    onPressedChange={setShowLineNumbers}
                    aria-label="Toggle line numbers"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>
              Enter or paste the text you want to compare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="old-text" className="text-sm font-medium">
                  Original Text
                </label>
                <Textarea
                  id="old-text"
                  value={oldText}
                  onChange={(e) => setOldText(e.target.value)}
                  className="h-48 font-mono"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="new-text" className="text-sm font-medium">
                  Modified Text
                </label>
                <Textarea
                  id="new-text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="h-48 font-mono"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExampleChange("simple")}
              >
                <FileTextIcon className="mr-1 h-4 w-4" />
                Simple Example
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExampleChange("code")}
              >
                <Code2Icon className="mr-1 h-4 w-4" />
                Code Example
              </Button>
            </div>
            {!realTimeDiff && (
              <Button onClick={handleManualDiff}>
                <ZapIcon className="mr-1 h-4 w-4" />
                Compare
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Diff Output</CardTitle>
              <Badge variant="outline">
                <InfoIcon className="h-3 w-3 mr-1" />
                {selectedAlgorithm.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <DiffViewer
              oldText={debouncedOldText}
              newText={debouncedNewText}
              algorithm={selectedAlgorithm}
              viewMode={viewMode}
              showLineNumbers={showLineNumbers}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
