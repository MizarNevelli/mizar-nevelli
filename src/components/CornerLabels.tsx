import type { ReactNode } from "react";

type CornerLabelsProps = {
  topLeft?: ReactNode;
  topRight?: ReactNode;
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
  /** Vertical inset from top/bottom (default 5rem to clear the fixed nav). */
  top?: string;
  bottom?: string;
};

/**
 * Fixed-position corner coordinate labels that appear on every page. Reads as
 * observation-card metadata — the site's most distinctive visual signature.
 */
export function CornerLabels({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  top = "5rem",
  bottom = "1.5rem",
}: CornerLabelsProps) {
  return (
    <>
      {topLeft && (
        <div
          className="fixed left-6 z-40 hidden md:block"
          style={{ top }}
          aria-hidden
        >
          <span className="coord">{topLeft}</span>
        </div>
      )}
      {topRight && (
        <div
          className="fixed right-6 z-40 hidden md:block"
          style={{ top }}
          aria-hidden
        >
          <span className="coord">{topRight}</span>
        </div>
      )}
      {bottomLeft && (
        <div
          className="fixed left-6 z-40 hidden md:block"
          style={{ bottom }}
          aria-hidden
        >
          <span className="coord">{bottomLeft}</span>
        </div>
      )}
      {bottomRight && (
        <div
          className="fixed right-6 z-40 hidden md:block"
          style={{ bottom }}
          aria-hidden
        >
          <span className="coord">{bottomRight}</span>
        </div>
      )}
    </>
  );
}
