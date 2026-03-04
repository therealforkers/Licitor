"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ALL_OPTION = "__all";

type FilterDropdownProps<TValue extends string> = {
  disabled: boolean;
  label: string;
  onValueChange: (value: string) => void;
  options: ReadonlyArray<{ label: string; value: TValue }>;
  value?: TValue;
};

export function FilterDropdown<TValue extends string>({
  disabled,
  label,
  onValueChange,
  options,
  value,
}: FilterDropdownProps<TValue>) {
  const activeLabel = options.find((option) => option.value === value)?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" disabled={disabled}>
          {activeLabel ?? label}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuRadioGroup
          value={value ?? ALL_OPTION}
          onValueChange={onValueChange}
        >
          <DropdownMenuRadioItem value={ALL_OPTION}>All</DropdownMenuRadioItem>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
