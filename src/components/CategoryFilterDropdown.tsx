"use client";

import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MEMO_CATEGORIES } from "@/types/memo";
import { cn } from "@/lib/utils";

const FILTER_ALL = "전체";

export type CategoryFilterValue = typeof FILTER_ALL | (typeof MEMO_CATEGORIES)[number];

interface CategoryFilterDropdownProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

export function CategoryFilterDropdown({ value, onChange }: CategoryFilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 min-w-[120px] justify-between",
            "transition-all duration-200 ease-out hover:bg-accent/80"
          )}
        >
          <Filter className="size-4 opacity-70" />
          <span>{value}</span>
          <ChevronDown className="size-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>카테고리 필터</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onChange(FILTER_ALL)}
          className={cn(value === FILTER_ALL && "bg-accent")}
        >
          {FILTER_ALL}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {MEMO_CATEGORIES.map((cat) => (
          <DropdownMenuItem
            key={cat}
            onClick={() => onChange(cat)}
            className={cn(value === cat && "bg-accent")}
          >
            {cat}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
