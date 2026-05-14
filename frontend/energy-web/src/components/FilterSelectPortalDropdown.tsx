import { createPortal } from 'react-dom';
import {
  useLayoutEffect,
  useState,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from 'react';

type Props = {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  panelRef: MutableRefObject<HTMLDivElement | null>;
  className: string;
  children: ReactNode;
};

export function FilterSelectPortalDropdown({ open, anchorRef, panelRef, className, children }: Props) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const anchor = anchorRef.current;
    const update = () => {
      const r = anchor.getBoundingClientRect();
      const gap = 8;
      const maxH = Math.max(120, Math.min(280, window.innerHeight - r.bottom - gap - 16));
      setStyle({
        position: 'fixed',
        top: Math.round(r.bottom + gap),
        left: Math.round(r.left),
        width: Math.round(r.width),
        maxHeight: maxH,
        zIndex: 10000,
      });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, anchorRef]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={panelRef}
      role="listbox"
      className={className}
      style={style}
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </div>,
    document.body
  );
}
