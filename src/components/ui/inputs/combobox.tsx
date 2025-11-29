"use client";

import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/shadcn/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/shadcn/command";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  readonly value: string;
  readonly label: string;
}

export interface ComboboxProps {
  readonly options: ComboboxOption[];
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
  readonly placeholder?: string;
  readonly emptyText?: string;
  readonly searchPlaceholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly maxVisibleOptions?: number;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Selecciona…",
  emptyText = "Sin resultados.",
  searchPlaceholder = "Buscar…",
  disabled = false,
  className = "",
  maxVisibleOptions = 8,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  const handleChange = (val: string) => {
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="default"
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            "hover:bg-orange-50 hover:border-orange-300",
            "focus:ring-2 focus:ring-orange-400 focus:border-orange-400",
            selected && "text-orange-700 border-orange-300 bg-orange-50/50",
            className,
          )}
        >
          <span className="truncate text-left flex-1">
            {selected ? selected.label : <span className="text-muted-foreground">{placeholder}</span>}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-[--radix-popover-trigger-width] min-w-[400px]"
        align="start"
        sideOffset={4}
      >
        <Command
          className=""
          filter={(value: string, search: string) => {
            const normalizedSearch = search.toLowerCase();
            const normalizedValue = value.toLowerCase();
            return normalizedValue.includes(normalizedSearch) ? 1 : 0;
          }}
        >
          <CommandInput placeholder={searchPlaceholder} className="border-b" />
          <CommandList className="" style={{ maxHeight: `${maxVisibleOptions * 40}px` }}>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup className="">
              {options.map((opt) => {
                const isActive = opt.value === value;
                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => handleChange(opt.value)}
                    className={cn(
                      "cursor-pointer",
                      "aria-selected:bg-orange-100 aria-selected:text-orange-900",
                      isActive && "bg-orange-50 text-orange-800",
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        isActive ? "opacity-100 text-orange-600" : "opacity-0"
                      )}
                    />
                    <span className="flex-1">{opt.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
