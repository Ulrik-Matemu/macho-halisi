"use client";

import React from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import Button from "@/components/dashboard/ui/Button";
import IconButton from "@/components/dashboard/ui/IconButton";

interface ListEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  /** Heading shown on each card, e.g. the item's name or "New space". */
  titleOf: (item: T, index: number) => string;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  makeItem: () => T;
  addLabel: string;
  emptyText: string;
  disabled?: boolean;
}

/** Ordered list of editable cards with add / remove / move up / move down. */
export default function ListEditor<T>({
  items,
  onChange,
  titleOf,
  renderItem,
  makeItem,
  addLabel,
  emptyText,
  disabled = false,
}: ListEditorProps<T>) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm" style={{ color: "var(--dash-text-subtle)" }}>
          {emptyText}
        </p>
      )}

      {items.map((item, index) => (
        <div
          key={index}
          className="p-4 rounded-lg space-y-4"
          style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium truncate" style={{ color: "var(--dash-text)" }}>
              {titleOf(item, index)}
            </span>
            {!disabled && (
              <div className="flex items-center gap-1 shrink-0">
                <IconButton label="Move up" onClick={() => move(index, index - 1)} disabled={index === 0}>
                  <ArrowUp className="w-4 h-4" />
                </IconButton>
                <IconButton label="Move down" onClick={() => move(index, index + 1)} disabled={index === items.length - 1}>
                  <ArrowDown className="w-4 h-4" />
                </IconButton>
                <IconButton label="Remove" tone="danger" onClick={() => onChange(items.filter((_, i) => i !== index))}>
                  <Trash2 className="w-4 h-4" />
                </IconButton>
              </div>
            )}
          </div>
          {renderItem(item, (patch) => onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it))), index)}
        </div>
      ))}

      {!disabled && (
        <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => onChange([...items, makeItem()])}>
          {addLabel}
        </Button>
      )}
    </div>
  );
}
