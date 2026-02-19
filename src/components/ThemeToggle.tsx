"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className={cn(
        "relative h-9 w-9 rounded-full overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:scale-110 active:scale-95",
        "hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        )}
        aria-hidden={!isDark}
      >
        <Moon className="size-4" />
      </span>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out",
          !isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        )}
        aria-hidden={isDark}
      >
        <Sun className="size-4" />
      </span>
    </Button>
  );
}
