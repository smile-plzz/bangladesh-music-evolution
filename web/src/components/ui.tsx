import Link from "next/link";
import { strandColor } from "@/lib/strands";

export function PageHeader({
  eyebrow,
  title,
  lede,
  meta,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  meta?: React.ReactNode;
}) {
  return (
    <header className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-8">
      {eyebrow ? (
        <p className="text-sm uppercase tracking-widest text-emerald-400 font-medium mb-3">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
      {lede ? (
        <p className="mt-4 max-w-3xl text-neutral-400 leading-relaxed">{lede}</p>
      ) : null}
      {meta ? <div className="mt-4 text-sm text-neutral-500">{meta}</div> : null}
    </header>
  );
}

export function StrandBadge({
  strand,
  count,
}: {
  strand: string;
  count?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-300">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: strandColor(strand) }}
        aria-hidden
      />
      {strand}
      {count !== undefined ? (
        <span className="text-neutral-500">{count}</span>
      ) : null}
    </span>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-neutral-800 bg-neutral-900/50 ${className}`}
    >
      {children}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-neutral-800 p-10 text-center text-sm text-neutral-500">
      {children}
    </div>
  );
}

/** A short, honest note about what a view's data does and does not cover. */
export function Caveat({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 max-w-3xl text-xs text-neutral-500 leading-relaxed border-l-2 border-neutral-800 pl-3">
      {children}
    </p>
  );
}

export function CrossLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-emerald-400 hover:underline">
      {children}
    </Link>
  );
}
