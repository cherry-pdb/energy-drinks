type Props = {
  search: string;
  selectedBrand: string;
  selectedCountry: string;
  sugarFreeOnly: boolean;
  brands: string[];
  countryOptions: { code: string; name: string }[];
  onSearchChange: (v: string) => void;
  onBrandChange: (v: string) => void;
  onCountryChange: (v: string) => void;
  onSugarFreeChange: (v: boolean) => void;
};

export function FilterBar(props: Props) {
  return (
    <section className="filter-bar">
      <input className="input" placeholder="Search by brand, line or flavor" value={props.search} onChange={(e) => props.onSearchChange(e.target.value)} />
      <select className="input" value={props.selectedBrand} onChange={(e) => props.onBrandChange(e.target.value)}>
        <option value="">All brands</option>
        {props.brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
      </select>
      <select className="input" value={props.selectedCountry} onChange={(e) => props.onCountryChange(e.target.value)} aria-label="Country filter">
        <option value="">All countries</option>
        {props.countryOptions.map((c) => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
      <label className="checkbox-row"><input type="checkbox" checked={props.sugarFreeOnly} onChange={(e) => props.onSugarFreeChange(e.target.checked)} /> Sugar free only</label>
    </section>
  );
}
