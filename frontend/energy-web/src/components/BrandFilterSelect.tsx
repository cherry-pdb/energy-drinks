import { useEffect, useMemo, useRef, useState } from 'react';
import { FilterSelectPortalDropdown } from './FilterSelectPortalDropdown';

type Props = {
  value: string;
  brands: string[];
  onChange: (brand: string) => void;
  'aria-label'?: string;
};

const DEFAULT_BRAND_ICONS_BASE = 'https://energy.nmv-services.ru/s3/icons';

function brandIconUrl(brand: string): string {
  const slug = brand.trim().toLowerCase().replace(/\s+/g, '');
  if (!slug) return '';
  const base = (import.meta.env.VITE_BRAND_ICONS_BASE_URL ?? DEFAULT_BRAND_ICONS_BASE).replace(/\/$/, '');
  return `${base}/${slug}.svg`;
}

function BrandMonogram({ brand }: { brand: string }) {
  const ch = brand.trim().charAt(0).toUpperCase() || '?';
  return (
    <span className="brand-filter-monogram" aria-hidden>
      {ch}
    </span>
  );
}

function BrandFilterIcon({ brand }: { brand: string }) {
  const url = useMemo(() => brandIconUrl(brand), [brand]);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [brand, url]);

  if (!url || broken) {
    return <BrandMonogram brand={brand} />;
  }

  return (
    <img
      src={url}
      alt=""
      className="brand-filter-icon"
      width={22}
      height={22}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  );
}

export function BrandFilterSelect({ value, brands, onChange, 'aria-label': ariaLabel = 'Brand filter' }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = useMemo(() => {
    if (!value) return null;
    return brands.find((b) => b === value) ?? value;
  }, [brands, value]);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || dropdownRef.current?.contains(t)) return;
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
    <div className="country-filter-select">
      <button
        ref={triggerRef}
        type="button"
        className="input country-filter-select-trigger"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="country-filter-select-flag-slot" aria-hidden>
          {selectedLabel ? <BrandFilterIcon brand={selectedLabel} /> : null}
        </span>
        <span className="country-filter-select-label">{selectedLabel ?? 'All brands'}</span>
        <span className="country-filter-select-chevron" aria-hidden>
          {open ? '▲' : '▼'}
        </span>
      </button>

      <FilterSelectPortalDropdown open={open} anchorRef={triggerRef} panelRef={dropdownRef} className="country-filter-select-dropdown">
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
              <BrandFilterIcon brand={b} />
            </span>
            <span className="country-filter-select-option-text">{b}</span>
            <span className="country-filter-select-code country-filter-select-code-spacer muted" aria-hidden />
          </button>
        ))}
      </FilterSelectPortalDropdown>
    </div>
  );
}
