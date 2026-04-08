import { useEffect, useMemo, useRef, useState } from 'react';
import { COUNTRIES, type CountryOption, findCountry } from '../data/countries';
import { FlagIcon } from './FlagIcon';

function unique(values: string[]) {
  return Array.from(new Set(values));
}

type Props = {
  value: string[] | null | undefined;
  onChange: (next: string[] | null) => void;
  placeholder?: string;
};

export function CountryMultiSelect({
  value,
  onChange,
  placeholder = 'Search countries — click to open list',
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedCodes = useMemo(() => unique((value ?? []).map((x) => x.trim().toUpperCase()).filter(Boolean)), [value]);

  const selectedOptions = useMemo(() => {
    return selectedCodes.map((code) => findCountry(code) ?? ({ code, name: code, flag: '' } as CountryOption));
  }, [selectedCodes]);

  const filtered = useMemo(() => {
    const unselected = COUNTRIES.filter((c) => !selectedCodes.includes(c.code));
    const q = query.trim().toLowerCase();
    if (!q) return unselected;
    return unselected.filter((c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
  }, [query, selectedCodes]);

  function setSelected(nextCodes: string[]) {
    const next = unique(nextCodes.map((c) => c.toUpperCase()));
    onChange(next.length ? next : null);
  }

  function addByCode(code: string) {
    const upper = code.trim().toUpperCase();
    if (!upper) return;
    setSelected([...selectedCodes, upper]);
    setQuery('');
  }

  function remove(code: string) {
    setSelected(selectedCodes.filter((c) => c !== code));
  }

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
    <div ref={rootRef} className="country-multi" style={{ position: 'relative', gridColumn: '1 / -1' }}>
      <label className="country-multi-label" style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#9db0cf' }}>
        Countries
      </label>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        {selectedOptions.map((c) => (
          <button
            key={c.code}
            type="button"
            className="badge badge-gray"
            onClick={() => remove(c.code)}
            title="Click to remove"
            style={{ border: '0', cursor: 'pointer' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <FlagIcon code={c.code} size={18} />
              {c.name}
            </span>
          </button>
        ))}
      </div>

      <input
        className="input"
        placeholder={placeholder}
        value={query}
        autoComplete="off"
        aria-expanded={open}
        aria-haspopup="listbox"
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (filtered[0]) addByCode(filtered[0].code);
            else {
              const raw = query.trim().toUpperCase();
              if (/^[A-Z]{2}$/.test(raw)) addByCode(raw);
            }
          }
        }}
      />

      {open ? (
        <div
          role="listbox"
          className="country-multi-dropdown"
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: 'absolute',
            zIndex: 1000,
            left: 0,
            right: 0,
            marginTop: 8,
            maxHeight: 280,
            overflowY: 'auto',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,.12)',
            background: 'rgba(10,18,32,.98)',
            boxShadow: '0 18px 40px rgba(0,0,0,.45)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: '14px 16px', color: '#9db0cf', fontSize: 14 }}>No matches — try another name or ISO code (e.g. DE)</div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                role="option"
                onClick={() => {
                  addByCode(c.code);
                  setOpen(true);
                }}
                style={{
                  display: 'flex',
                  gap: 10,
                  width: '100%',
                  padding: '10px 14px',
                  border: 0,
                  borderBottom: '1px solid rgba(255,255,255,.06)',
                  background: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ width: 28, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <FlagIcon code={c.code} size={22} />
                </span>
                <span style={{ flex: 1 }}>{c.name}</span>
                <span className="muted" style={{ flexShrink: 0 }}>{c.code}</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
