"use client";

/** Reusable filter controls shared by the explorer pages. */

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 pr-8 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-200"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

export function ChipGroup({
  label,
  options,
  active,
  onToggle,
  colorFor,
}: {
  label: string;
  options: { value: string; count?: number }[];
  active: string[];
  onToggle: (value: string) => void;
  colorFor?: (value: string) => string;
}) {
  if (options.length === 0) return null;
  return (
    <fieldset>
      <legend className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
        {label}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = active.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onToggle(o.value)}
              aria-pressed={on}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                on
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
              }`}
            >
              {colorFor ? (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: colorFor(o.value) }}
                  aria-hidden
                />
              ) : null}
              {o.value}
              {o.count !== undefined ? (
                <span className={on ? "text-emerald-500/70" : "text-neutral-600"}>
                  {o.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ResultCount({
  shown,
  total,
  noun,
  onReset,
  filtered,
}: {
  shown: number;
  total: number;
  noun: string;
  onReset: () => void;
  filtered: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm text-neutral-400">
      <span>
        <span className="text-neutral-100 font-medium tabular-nums">{shown}</span>{" "}
        of {total} {noun}
      </span>
      {filtered ? (
        <button
          type="button"
          onClick={onReset}
          className="text-emerald-400 hover:underline"
        >
          Reset filters
        </button>
      ) : null}
    </div>
  );
}

export function SortSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-neutral-400">
      <span className="text-xs uppercase tracking-wider text-neutral-500">
        Sort
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 focus:border-emerald-500 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
