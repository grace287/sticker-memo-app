"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 p-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => !isDark || toggleTheme()}
        className={cn(
          "gap-1.5 h-8 min-h-[44px] min-w-[44px] sm:min-h-8 sm:min-w-0 px-2 sm:px-3 rounded-md transition-colors",
          !isDark && "bg-background shadow-sm font-medium text-foreground"
        )}
        aria-pressed={!isDark}
        aria-label="라이트 모드"
      >
        <Sun className="size-4 shrink-0" />
        <span className="hidden sm:inline text-xs">라이트</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => isDark || toggleTheme()}
        className={cn(
          "gap-1.5 h-8 min-h-[44px] min-w-[44px] sm:min-h-8 sm:min-w-0 px-2 sm:px-3 rounded-md transition-colors",
          isDark && "bg-background shadow-sm font-medium text-foreground"
        )}
        aria-pressed={isDark}
        aria-label="다크 모드"
      >
        <Moon className="size-4 shrink-0" />
        <span className="hidden sm:inline text-xs">다크</span>
      </Button>
    </div>
  );
}
