"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ className, children, ...props }: SelectPrimitive.SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger className={cn("flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm", className)} {...props}>
      {children}
      <SelectPrimitive.Icon><ChevronDown className="h-4 w-4" /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <SelectPrimitive.Portal><SelectPrimitive.Content className="z-50 rounded-md border bg-background p-1 shadow-md"><SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>;
}

export function SelectItem({ className, children, ...props }: SelectPrimitive.SelectItemProps) {
  return <SelectPrimitive.Item className={cn("cursor-pointer rounded-sm px-2 py-1 text-sm outline-none hover:bg-accent", className)} {...props}><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText></SelectPrimitive.Item>;
}
