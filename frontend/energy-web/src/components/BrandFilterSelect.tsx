import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  value: string;
  brands: string[];
  onChange: (brand: string) => void;
  'aria-label'?: string;
};

function BrandMonogram({ brand }: { brand: string }) {
  const ch = brand.trim().charAt(0).toUpperCase() || '?';
  return (
    <span className="brand-filter-monogram" aria-hidden>
      {ch}
    </span>
  );
}

export function BrandFilterSelect({ value, brands, onChange, 'aria-label': ariaLabel = 'Brand filter' }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedLabel = useMemo(() => {
    if (!value) return null;
    return brands.find((b) => b === value) ?? value;
  }, [brands, value]);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      const el = rootRef.current;
      if (!el || el.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div ref={rootRef} className="country-filter-select">
      <button
        type="button"
        className="input country-filter-select-trigger"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="country-filter-select-flag-slot" aria-hidden>
          {selectedLabel ? <BrandMonogram brand={selectedLabel} /> : null}
        </span>
        <span className="country-filter-select-label">{selectedLabel ?? 'All brands'}</span>
        <span className="country-filter-select-chevron" aria-hidden>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open ? (
        <div
          role="listbox"
          className="country-filter-select-dropdown"
          onMouseDown={(e) => e.preventDefault()}
        >
          <button
            type="button"
            role="option"
            aria-selected={value === ''}
            className={`country-filter-select-option${value === '' ? ' is-active' : ''}`}
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
          >
            <span className="country-filter-select-flag-slot" aria-hidden />
            <span className="country-filter-select-option-text">All brands</span>
            <span className="country-filter-select-code country-filter-select-code-spacer muted" aria-hidden />
          </button>
          {brands.map((b) => (
            <button
              key={b}
              type="button"
              role="option"
              aria-selected={value === b}
              className={`country-filter-select-option${value === b ? ' is-active' : ''}`}
              onClick={() => {
                onChange(b);
                setOpen(false);
              }}
            >
              <span className="country-filter-select-flag-slot" aria-hidden>
                <BrandMonogram brand={b} />
              </span>
              <span className="country-filter-select-option-text">{b}</span>
              <span className="country-filter-select-code country-filter-select-code-spacer muted" aria-hidden />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
