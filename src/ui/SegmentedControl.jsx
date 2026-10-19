import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

/** Single-choice pill switch (Radix toggle group: arrow-key navigation built in). options: [{ value, label }] */
export function SegmentedControl({ options, value, onChange, label, className }) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v)}
      aria-label={label}
      className={cn('inline-flex rounded-full border-3 border-ink bg-card p-1', className)}
    >
      {options.map((o) => (
        <ToggleGroupItem key={o.value} value={o.value} aria-label={o.label}>
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
