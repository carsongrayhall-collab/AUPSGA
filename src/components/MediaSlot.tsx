import type { ReactNode } from "react";

type MediaSlotProps = {
  label: string;
  className?: string;
  tone?: "light" | "red";
  children?: ReactNode;
};

export function MediaSlot({
  label,
  className = "",
  tone = "light",
  children,
}: MediaSlotProps) {
  return (
    <div
      role="img"
      aria-label={label}
      data-media-slot={label}
      className={[
        "relative overflow-hidden bg-[#d9d9d9]",
        tone === "red" ? "bg-white/25" : "",
        "before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34)_0_1px,transparent_1px_18px)]",
        "after:absolute after:inset-3 after:border after:border-white/60",
        className,
      ].join(" ")}
    >
      <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70" />
      {children}
    </div>
  );
}
