import { useEffect, useMemo, useRef, useState } from 'react';
import { deleteEnergyDrink, getAdminUsername, getBrands, getEnergyDrinksPaged } from './api/energyApi';
import { AdminAuthCard } from './components/AdminAuthCard';
import { EnergyDrinkCard } from './components/EnergyDrinkCard';
import { EnergyDrinkForm } from './components/EnergyDrinkForm';
import { FilterBar } from './components/FilterBar';
import { StatCard } from './components/StatCard';
import { EnergyLogo } from './components/EnergyLogo';
import type { EnergyDrink } from './types/energy';

export default function App() {
  const [drinks, setDrinks] = useState<EnergyDrink[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sugarFreeOnly, setSugarFreeOnly] = useState(false);
  const [onlyFull, setOnlyFull] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [authVersion, setAuthVersion] = useState(0);
  const [editingDrink, setEditingDrink] = useState<EnergyDrink | null>(null);
  const [actionError, setActionError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const totalCountRef = useRef<number | null>(null);
  const loadKeyRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isAdmin = Boolean(getAdminUsername());
  const pageSize = 30;

  async function loadFirstPage() {
    setLoading(true);
    setActionError('');
    setHasMore(true);
    setPage(1);
    totalCountRef.current = null;
    const loadKey = ++loadKeyRef.current;

    try {
      const [paged, brandsData] = await Promise.all([
        getEnergyDrinksPaged({
          search: search || undefined,
          brand: selectedBrand || undefined,
          isSugarFree: sugarFreeOnly ? true : undefined,
          onlyFull,
          page: 1,
          pageSize,
        }),
        getBrands(),
      ]);

      if (loadKey !== loadKeyRef.current) return;

      setDrinks(paged.items);
      setBrands(brandsData);
      totalCountRef.current = paged.totalCount;
      setHasMore(paged.items.length < paged.totalCount);
    } finally {
      if (loadKey === loadKeyRef.current) setLoading(false);
    }
  }

  async function loadNextPage() {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    setActionError('');
    const nextPage = page + 1;
    const loadKey = loadKeyRef.current;

    try {
      const paged = await getEnergyDrinksPaged({
        search: search || undefined,
        brand: selectedBrand || undefined,
        isSugarFree: sugarFreeOnly ? true : undefined,
        onlyFull,
        page: nextPage,
        pageSize,
      });

      if (loadKey !== loadKeyRef.current) return;
      setDrinks((prev) => {
        const next = [...prev, ...paged.items];
        setHasMore(next.length < paged.totalCount);
        return next;
      });
      setPage(nextPage);
      totalCountRef.current = paged.totalCount;
    } finally {
      if (loadKey === loadKeyRef.current) setLoadingMore(false);
    }
  }

  useEffect(() => { loadFirstPage(); }, [search, selectedBrand, sugarFreeOnly, onlyFull, authVersion]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadNextPage();
      },
      { root: null, rootMargin: '600px 0px', threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, loadingMore, page, search, selectedBrand, sugarFreeOnly, onlyFull]);

  const stats = useMemo(() => {
    const totalStock = drinks.reduce((sum, x) => sum + x.quantity, 0);
    const sugarFree = drinks.filter((x) => x.isSugarFree).length;
    const expiringSoon = drinks.filter((x) => {
      const days = Math.ceil((new Date(x.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 30;
    }).length;
    return { totalItems: drinks.length, totalStock, sugarFree, expiringSoon };
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
      await loadFirstPage();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  function handleEdit(drink: EnergyDrink) {
    setEditingDrink(drink);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            onSaved={loadFirstPage}
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
          <StatCard label="Visible items" value={stats.totalItems} />
          <StatCard label="Total stock" value={stats.totalStock} />
          <StatCard label="Sugar free" value={stats.sugarFree} />
          <StatCard label="Expiring soon" value={stats.expiringSoon} hint="Within 30 days" />
        </section>

        <FilterBar
          search={search}
          selectedBrand={selectedBrand}
          sugarFreeOnly={sugarFreeOnly}
          onlyActive={onlyFull}
          brands={brands}
          onSearchChange={setSearch}
          onBrandChange={setSelectedBrand}
          onSugarFreeChange={setSugarFreeOnly}
          onOnlyActiveChange={setOnlyFull}
        />

        {actionError ? <div className="form-error panel-error">{actionError}</div> : null}

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : drinks.length === 0 ? (
          <div className="empty-state">No drinks found</div>
        ) : (
          <section className="drink-list">
            {drinks.map((drink) => (
              <EnergyDrinkCard
                key={drink.id}
                drink={drink}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            <div ref={sentinelRef} />
            {loadingMore ? <div className="empty-state">Loading more…</div> : null}
            {!hasMore ? <div className="empty-state">End of list</div> : null}
          </section>
        )}
      </main>
    </div>
  );
}
