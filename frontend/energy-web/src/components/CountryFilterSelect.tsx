import { useEffect, useMemo, useRef, useState } from 'react';
import { FlagIcon } from './FlagIcon';

type Option = { code: string; name: string };

type Props = {
  value: string;
  options: Option[];
  onChange: (code: string) => void;
  'aria-label'?: string;
};

export function CountryFilterSelect({ value, options, onChange, 'aria-label': ariaLabel = 'Country filter' }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => options.find((o) => o.code === value) ?? null, [options, value]);

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
          {selected ? <FlagIcon code={selected.code} size={22} /> : null}
        </span>
        <span className="country-filter-select-label">{selected ? selected.name : 'All countries'}</span>
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
            <span className="country-filter-select-option-text">All countries</span>
          </button>
          {options.map((c) => (
            <button
              key={c.code}
              type="button"
              role="option"
              aria-selected={value === c.code}
              className={`country-filter-select-option${value === c.code ? ' is-active' : ''}`}
              onClick={() => {
                onChange(c.code);
                setOpen(false);
              }}
            >
              <span className="country-filter-select-flag-slot" aria-hidden>
                <FlagIcon code={c.code} size={22} />
              </span>
              <span className="country-filter-select-option-text">{c.name}</span>
              <span className="country-filter-select-code muted">{c.code}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
