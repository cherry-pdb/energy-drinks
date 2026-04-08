import type { EnergyDrink } from '../types/energy';
import { findCountry } from '../data/countries';
import { FlagIcon } from './FlagIcon';

function formatPrice(price: number, currency: EnergyDrink['priceCurrency']) {
  const code = currency ?? 'USD';
  const symbol = code === 'EUR' ? '€' : code === 'RUB' ? '₽' : '$';
  return `${symbol}${price}`;
}

function daysUntilExpiration(date: string) {
  const now = new Date();
  const expiration = new Date(date);
  const diffMs = expiration.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

type Props = {
  drink: EnergyDrink;
  isAdmin?: boolean;
  onEdit?: (drink: EnergyDrink) => void;
  onDelete?: (drink: EnergyDrink) => void;
};

export function EnergyDrinkCard({ drink, isAdmin = false, onEdit, onDelete }: Props) {
  const daysLeft = daysUntilExpiration(drink.expirationDate);
  const isExpiringSoon = daysLeft <= 30;

  const countries = (drink.countries ?? []).filter(Boolean);
  const countryLabel = countries.length ? (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 10px' }}>
      {countries.map((code) => {
        const c = findCountry(code);
        const iso = c?.code ?? code.trim().toUpperCase();
        return (
          <span key={code} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <FlagIcon code={iso} size={18} />
            <span>{c?.name ?? code}</span>
          </span>
        );
      })}
    </span>
  ) : (
    'Country unknown'
  );

  return (
    <article className="drink-card">
      <div className="drink-image-wrap">
        {drink.imageUrl ? (
          <img src={drink.imageUrl} alt={drink.displayName} className="drink-image" />
        ) : (
          <div className="drink-image placeholder">⚡</div>
        )}
      </div>

      <div className="drink-content">
        <div className="drink-header-row">
          <div>
            <div className="drink-brand">{drink.brand}</div>
            <h3 className="drink-title">{drink.displayName}</h3>
          </div>
          <div className="drink-badges">
            {drink.isSugarFree ? <span className="badge badge-green">Sugar free</span> : null}
            {drink.canFillState === 'Empty' ? <span className="badge badge-gray">Empty can</span> : null}
            {isExpiringSoon ? <span className="badge badge-red">Expires soon</span> : null}
          </div>
        </div>

        <div className="drink-meta-grid">
          <div><span>Volume</span><strong>{drink.volumeMl} ml</strong></div>
          <div><span>Stock</span><strong>{drink.quantity}</strong></div>
          <div><span>Caffeine</span><strong>{drink.caffeineMg ?? '—'} mg</strong></div>
          <div><span>Sugar</span><strong>{drink.sugarGrams ?? '—'} g</strong></div>
          <div><span>Calories</span><strong>{drink.calories ?? '—'}</strong></div>
          <div><span>Price</span><strong>{drink.price != null ? formatPrice(drink.price, drink.priceCurrency) : '—'}</strong></div>
        </div>

        <div className="drink-footer-row">
          <span className="muted">{countryLabel}</span>
          <span className={isExpiringSoon ? 'danger' : 'muted'}>
            Expires: {new Date(drink.expirationDate).toLocaleDateString()}
          </span>
        </div>

        {isAdmin ? (
          <div className="admin-actions-row">
            <button className="button button-small button-secondary" type="button" onClick={() => onEdit?.(drink)}>
              Edit
            </button>
            <button className="button button-small button-danger" type="button" onClick={() => onDelete?.(drink)}>
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
