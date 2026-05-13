import { useEffect, useMemo, useState } from 'react';
import { deleteEnergyDrink, getAdminUsername, getBrands, getCatalogCountries, getEnergyDrinksPaged, markEnergyDrinkDrank } from './api/energyApi';
import { AdminAuthCard } from './components/AdminAuthCard';
import { EnergyDrinkCard } from './components/EnergyDrinkCard';
import { EnergyDrinkForm } from './components/EnergyDrinkForm';
import { FilterBar } from './components/FilterBar';
import { StatCard } from './components/StatCard';
import { EnergyLogo } from './components/EnergyLogo';
import { findCountry } from './data/countries';
import type { EnergyDrink } from './types/energy';

const PAGE_SIZE = 10;

export default function App() {
  const [drinks, setDrinks] = useState<EnergyDrink[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [catalogCountryCodes, setCatalogCountryCodes] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [sugarFreeOnly, setSugarFreeOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authVersion, setAuthVersion] = useState(0);
  const [editingDrink, setEditingDrink] = useState<EnergyDrink | null>(null);
  const [actionError, setActionError] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalQuantitySum, setTotalQuantitySum] = useState(0);
  const isAdmin = Boolean(getAdminUsername());

  const countryOptions = useMemo(
    () =>
      catalogCountryCodes
        .map((code) => ({ code, name: findCountry(code)?.name ?? code }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [catalogCountryCodes]
  );

  useEffect(() => {
    if (selectedCountry && !catalogCountryCodes.includes(selectedCountry)) {
      setSelectedCountry('');
    }
  }, [catalogCountryCodes, selectedCountry]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setActionError('');

      try {
        const [paged, brandsData, countriesData] = await Promise.all([
          getEnergyDrinksPaged({
            search: search || undefined,
            brand: selectedBrand || undefined,
            country: selectedCountry || undefined,
            isSugarFree: sugarFreeOnly ? true : undefined,
            onlyFull: false,
            page,
            pageSize: PAGE_SIZE,
          }),
          getBrands(),
          getCatalogCountries(),
        ]);

        if (cancelled) return;
        setDrinks(paged.items);
        setBrands(brandsData);
        setCatalogCountryCodes(countriesData);
        setTotalCount(paged.totalCount);
        setTotalQuantitySum(paged.totalQuantitySum);
      } catch (err) {
        if (!cancelled) {
          setActionError(err instanceof Error ? err.message : 'Failed to load');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadData();
    return () => {
      cancelled = true;
    };
  }, [page, search, selectedBrand, selectedCountry, sugarFreeOnly, authVersion]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const stats = useMemo(() => {
    const sugarFree = drinks.filter((x) => x.isSugarFree).length;
    const expiringSoon = drinks.filter((x) => {
      if (!x.expirationDate) return false;
      const days = Math.ceil((new Date(x.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 30;
    }).length;
    return { sugarFree, expiringSoon };
  }, [drinks]);

  async function handleDelete(drink: EnergyDrink) {
    const confirmed = window.confirm(`Delete ${drink.displayName}? This action cannot be undone.`);
    if (!confirmed) return;

    setActionError('');
    try {
      await deleteEnergyDrink(drink.id);
      if (editingDrink?.id === drink.id) {
        setEditingDrink(null);
      }
      setAuthVersion((v) => v + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  async function handleDrank(drink: EnergyDrink) {
    setActionError('');
    try {
      await markEnergyDrinkDrank(drink.id);
      setAuthVersion((v) => v + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Update failed');
    }
  }

  function handleEdit(drink: EnergyDrink) {
    setEditingDrink(drink);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reloadAfterSave() {
    setPage(1);
    setAuthVersion((v) => v + 1);
  }

  return (
    <div className="page-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo" aria-hidden>
            <EnergyLogo />
          </div>
          <div>
            <div className="eyebrow">Inventory dashboard</div>
            <h1>EnergyDrinks</h1>
          </div>
        </div>
        <AdminAuthCard onAuthChanged={() => { setAuthVersion((x) => x + 1); setEditingDrink(null); }} />
        {isAdmin ? (
          <EnergyDrinkForm
            onSaved={reloadAfterSave}
            editingDrink={editingDrink}
            onCancelEdit={() => setEditingDrink(null)}
          />
        ) : (
          <div className="locked-card">
            <h3>Catalog editing is locked</h3>
            <p>Sign in as admin to add, update or delete drinks.</p>
          </div>
        )}
      </aside>

      <main className="main-content">
        <section className="hero-card">
          <div>
            <div className="eyebrow">Warehouse catalog</div>
            <h2>Clean dashboard for brand, line and flavor based inventory</h2>
            <p>Fast search, stock visibility, expiration control and sugar-free tracking.</p>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard label="Matching drinks" value={totalCount} />
          <StatCard label="Total stock" value={totalQuantitySum} hint="All matching filters" />
          <StatCard label="Sugar free" value={stats.sugarFree} hint="On this page" />
          <StatCard label="Expiring soon" value={stats.expiringSoon} hint="On this page · within 30 days" />
        </section>

        <FilterBar
          search={search}
          selectedBrand={selectedBrand}
          selectedCountry={selectedCountry}
          sugarFreeOnly={sugarFreeOnly}
          brands={brands}
          countryOptions={countryOptions}
          onSearchChange={(v) => {
            setPage(1);
            setSearch(v);
          }}
          onBrandChange={(v) => {
            setPage(1);
            setSelectedBrand(v);
          }}
          onCountryChange={(v) => {
            setPage(1);
            setSelectedCountry(v);
          }}
          onSugarFreeChange={(v) => {
            setPage(1);
            setSugarFreeOnly(v);
          }}
        />

        {actionError ? <div className="form-error panel-error">{actionError}</div> : null}

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : drinks.length === 0 ? (
          <div className="empty-state">No drinks found</div>
        ) : (
          <>
            <section className="drink-list">
              {drinks.map((drink) => (
                <EnergyDrinkCard
                  key={drink.id}
                  drink={drink}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDrank={handleDrank}
                />
              ))}
            </section>
            <nav className="pagination-bar" aria-label="Pagination">
              <button
                type="button"
                className="button button-secondary pagination-btn"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="pagination-meta">
                Page {page} of {totalPages}
                <span className="pagination-count"> ({totalCount} total)</span>
              </span>
              <button
                type="button"
                className="button button-secondary pagination-btn"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </nav>
          </>
        )}
      </main>
    </div>
  );
}
