import { cn } from "@/lib/utils";

/**
 * Vente Venezuela wordmark: a white star emblem beside the party name.
 * Rendered as inline SVG so it stays crisp at any size and needs no asset.
 */
export function PartyLogo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 48 48"
        role="img"
        aria-label="Emblema de Vente Venezuela"
        className="h-9 w-9 shrink-0 drop-shadow-[0_2px_6px_rgba(6,32,60,0.45)]"
      >
        <circle cx="24" cy="24" r="23" fill="rgba(255,255,255,0.14)" />
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.5"
        />
        <path
          d="M24 9.5l4.3 8.9 9.7 1.4-7 6.9 1.7 9.7-8.7-4.6-8.7 4.6 1.7-9.7-7-6.9 9.7-1.4z"
          fill="#ffffff"
        />
        <path
          d="M24 15.5l2.6 5.4 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9z"
          fill="oklch(0.82 0.155 84)"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight text-white">
          Vente
        </span>
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/80">
          Venezuela
        </span>
      </span>
    </span>
  );
}
