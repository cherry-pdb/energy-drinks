import { BrandFilterSelect } from './BrandFilterSelect';
import { CountryFilterSelect } from './CountryFilterSelect';

type Props = {
  search: string;
  selectedBrand: string;
  selectedCountry: string;
  sugarFreeOnly: boolean;
  onlyFull: boolean;
  brands: string[];
  countryOptions: { code: string; name: string }[];
  onSearchChange: (v: string) => void;
  onBrandChange: (v: string) => void;
  onCountryChange: (v: string) => void;
  onSugarFreeChange: (v: boolean) => void;
  onOnlyFullChange: (v: boolean) => void;
};

export function FilterBar(props: Props) {
  return (
    <section className="filter-bar">
      <input className="input filter-bar-search" placeholder="Search by name" value={props.search} onChange={(e) => props.onSearchChange(e.target.value)} />
      <div className="filter-bar-cluster">
        <BrandFilterSelect
          value={props.selectedBrand}
          brands={props.brands}
          onChange={props.onBrandChange}
          aria-label="Brand filter"
        />
        <CountryFilterSelect
          value={props.selectedCountry}
          options={props.countryOptions}
          onChange={props.onCountryChange}
          aria-label="Country filter"
        />
        <label className="checkbox-row filter-bar-toggle"><input type="checkbox" checked={props.sugarFreeOnly} onChange={(e) => props.onSugarFreeChange(e.target.checked)} /> Sugar free</label>
        <label className="checkbox-row filter-bar-toggle"><input type="checkbox" checked={props.onlyFull} onChange={(e) => props.onOnlyFullChange(e.target.checked)} /> Full</label>
      </div>
    </section>
  );
}
