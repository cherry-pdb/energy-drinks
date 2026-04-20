import { useEffect, useState } from 'react';
import { createEnergyDrink, updateEnergyDrink, uploadImage } from '../api/energyApi';
import type { CreateEnergyDrinkRequest, EnergyDrink } from '../types/energy';
import { CountryMultiSelect } from './CountryMultiSelect';

type FormState = Omit<CreateEnergyDrinkRequest, 'volumeMl' | 'quantity'> & {
  volumeMl: string;
  quantity: string;
};

const createInitialForm = (): FormState => ({
  brand: '',
  line: '',
  flavor: '',
  volumeMl: '',
  expirationDate: new Date().toISOString().slice(0, 10),
  price: null,
  priceCurrency: 'USD',
  quantity: '',
  caffeineMg: null,
  sugarGrams: null,
  calories: null,
  isSugarFree: false,
  countries: null,
  imageUrl: '',
  canFillState: 'Full',
});

function toForm(drink: EnergyDrink): CreateEnergyDrinkRequest {
  return {
    brand: drink.brand,
    line: drink.line ?? '',
    flavor: drink.flavor ?? '',
    volumeMl: drink.volumeMl,
    expirationDate: drink.expirationDate ? drink.expirationDate.slice(0, 10) : null,
    price: drink.price ?? null,
    priceCurrency: drink.priceCurrency ?? 'USD',
    quantity: drink.quantity,
    caffeineMg: drink.caffeineMg ?? null,
    sugarGrams: drink.sugarGrams ?? null,
    calories: drink.calories ?? null,
    isSugarFree: drink.isSugarFree,
    countries: drink.countries ?? null,
    imageUrl: drink.imageUrl ?? '',
    canFillState: drink.canFillState,
  };
}

function toFormState(drink: EnergyDrink): FormState {
  const dto = toForm(drink);
  return {
    ...dto,
    volumeMl: String(dto.volumeMl),
    quantity: String(dto.quantity),
  };
}

type Props = {
  onSaved: () => void;
  editingDrink?: EnergyDrink | null;
  onCancelEdit: () => void;
};

export function EnergyDrinkForm({ onSaved, editingDrink, onCancelEdit }: Props) {
  const [form, setForm] = useState<FormState>(createInitialForm());
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(editingDrink);

  useEffect(() => {
    setForm(editingDrink ? toFormState(editingDrink) : createInitialForm());
    setError('');
  }, [editingDrink]);

  async function onPickImage(file: File | null) {
    if (!file) return;
    setError('');
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const volumeMl = Number(form.volumeMl);
    const quantity = Number(form.quantity);

    if (!Number.isFinite(volumeMl) || volumeMl <= 0) {
      setLoading(false);
      setError('Volume must be a positive number');
      return;
    }

    if (!Number.isFinite(quantity) || quantity < 0) {
      setLoading(false);
      setError('Quantity must be 0 or greater');
      return;
    }

    const payload: CreateEnergyDrinkRequest = {
      ...form,
      volumeMl,
      quantity,
      line: form.line || null,
      flavor: form.flavor || null,
      countries: form.countries && form.countries.length ? form.countries : null,
      expirationDate: form.canFillState === 'Empty' ? null : form.expirationDate,
      imageUrl: form.imageUrl || null,
    };

    try {
      if (editingDrink) {
        await updateEnergyDrink(editingDrink.id, payload);
      } else {
        await createEnergyDrink(payload);
      }
      setForm(createInitialForm());
      onSaved();
      onCancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-header">
        <h2>{isEditing ? 'Edit drink' : 'Add new drink'}</h2>
        <p>{isEditing ? 'Update catalog data and save changes.' : 'Structured catalog with clean fields for brand, line and flavor.'}</p>
      </div>

      <div className="form-grid">
        <input className="input" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
        <input className="input" placeholder="Line" value={form.line ?? ''} onChange={(e) => setForm({ ...form, line: e.target.value })} />
        <input className="input" placeholder="Flavor" value={form.flavor ?? ''} onChange={(e) => setForm({ ...form, flavor: e.target.value })} />
        <input className="input" type="number" placeholder="Volume ml" value={form.volumeMl} onChange={(e) => setForm({ ...form, volumeMl: e.target.value })} required />
        <input
          className="input"
          type="date"
          value={form.expirationDate ?? ''}
          onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
          required={form.canFillState !== 'Empty'}
          disabled={form.canFillState === 'Empty'}
        />
        <select className="input" value={form.priceCurrency ?? 'USD'} onChange={(e) => setForm({ ...form, priceCurrency: e.target.value as CreateEnergyDrinkRequest['priceCurrency'] })}>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="RUB">RUB (₽)</option>
        </select>
        <input className="input" type="number" step="0.01" placeholder="Price" value={form.price ?? ''} onChange={(e) => setForm({ ...form, price: e.target.value ? Number(e.target.value) : null })} />
        <input className="input" type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <input className="input" type="number" placeholder="Caffeine mg" value={form.caffeineMg ?? ''} onChange={(e) => setForm({ ...form, caffeineMg: e.target.value ? Number(e.target.value) : null })} />
        <input className="input" type="number" placeholder="Sugar g" value={form.sugarGrams ?? ''} onChange={(e) => setForm({ ...form, sugarGrams: e.target.value ? Number(e.target.value) : null })} />
        <input className="input" type="number" placeholder="Calories" value={form.calories ?? ''} onChange={(e) => setForm({ ...form, calories: e.target.value ? Number(e.target.value) : null })} />
        <CountryMultiSelect value={form.countries} onChange={(next) => setForm({ ...form, countries: next })} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            className="input"
            type="file"
            accept="image/*"
            disabled={uploadingImage || loading}
            onChange={(e) => void onPickImage(e.target.files?.[0] ?? null)}
          />
          <input
            className="input"
            placeholder={uploadingImage ? 'Uploading image...' : 'Image URL (auto-filled)'}
            value={form.imageUrl ?? ''}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            disabled={uploadingImage}
          />
        </div>
      </div>

      <div className="form-row switches">
        <label className="checkbox-row"><input type="checkbox" checked={form.isSugarFree} onChange={(e) => setForm({ ...form, isSugarFree: e.target.checked })} /> Sugar free</label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.canFillState !== 'Empty'}
            onChange={(e) => setForm({ ...form, canFillState: e.target.checked ? 'Full' : 'Empty' })}
          />
          Full can
        </label>
      </div>

      {error ? <div className="form-error">{error}</div> : null}

      <div className="form-actions">
        <button className="button" disabled={loading} type="submit">{loading ? 'Saving...' : isEditing ? 'Save changes' : 'Create drink'}</button>
        {isEditing ? (
          <button className="button button-secondary" type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
