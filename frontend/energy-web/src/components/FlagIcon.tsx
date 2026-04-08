import type { ComponentType } from 'react';
import { useMemo } from 'react';
import * as Flags from 'country-flag-icons/react/3x2';

type Props = {
  code: string;
  size?: number;
  className?: string;
};

export function FlagIcon({ code, size = 20, className }: Props) {
  const upper = code.trim().toUpperCase();
  const valid = /^[A-Z]{2}$/.test(upper);

  const Flag = useMemo(() => {
    if (!valid) return null;
    return (Flags as unknown as Record<string, ComponentType<{ title?: string; className?: string }>>)[upper] ?? null;
  }, [upper, valid]);

  if (!valid || !Flag) {
    return (
      <span className={className} title={code} aria-hidden style={{ fontSize: size * 0.75 }}>
        🏳️
      </span>
    );
  }

  const h = Math.round(size * 0.75);
  return (
    <span
      className={className}
      style={{
        width: size,
        height: h,
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: 2,
        overflow: 'hidden',
        background: 'rgba(255,255,255,.06)',
      }}
      aria-hidden
      title={upper}
    >
      <Flag />
    </span>
  );
}
