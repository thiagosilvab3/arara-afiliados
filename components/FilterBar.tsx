"use client";

import { PriceFilter } from "../lib/types";
import styles from "./FilterBar.module.css";

interface FilterBarProps {
  query: string;
  niche: string;
  priceFilter: PriceFilter;
  minPopularity: number;
  sortBy: string;
  onQueryChange: (value: string) => void;
  onNicheChange: (value: string) => void;
  onPriceFilterChange: (value: PriceFilter) => void;
  onPopularityChange: (value: number) => void;
  onSortChange: (value: string) => void;
  onClear: () => void;
}

export function FilterBar({
  query,
  niche,
  priceFilter,
  minPopularity,
  sortBy,
  onQueryChange,
  onNicheChange,
  onPriceFilterChange,
  onPopularityChange,
  onSortChange,
  onClear
}: FilterBarProps) {
  return (
    <section className={`panel ${styles.filterBar}`}>
      <div className={styles.grid}>
        <div className={styles.spanTwo}>
          <label className={styles.label}>Buscar</label>
          <input
            className="field"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Ex.: tráfego, inglês, emagrecimento..."
          />
        </div>

        <div>
          <label className={styles.label}>Nicho</label>
          <select
            className="select"
            value={niche}
            onChange={(e) => onNicheChange(e.target.value)}
          >
            <option>Todos</option>
            <option>Marketing Digital</option>
            <option>Finanças</option>
            <option>Fitness</option>
            <option>Idiomas</option>
          </select>
        </div>

        <div>
          <label className={styles.label}>Faixa de preço</label>
          <select
            className="select"
            value={priceFilter}
            onChange={(e) => onPriceFilterChange(e.target.value as PriceFilter)}
          >
            <option value="all">Todos</option>
            <option value="upTo100">Até R$ 100</option>
            <option value="100To300">R$ 100 a R$ 300</option>
            <option value="300To600">R$ 300 a R$ 600</option>
            <option value="above600">Acima de R$ 600</option>
          </select>
        </div>

        <div>
          <label className={styles.label}>Ordenação</label>
          <select
            className="select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="popularidade">Mais populares</option>
            <option value="avaliacao">Melhor avaliados</option>
            <option value="menor-preco">Menor preço</option>
            <option value="maior-preco">Maior preço</option>
          </select>
        </div>
      </div>

      <div className={styles.bottom}>
        <div>
          <div className={styles.rangeHeader}>
            <span className={styles.label}>Popularidade mínima</span>
            <strong>{minPopularity}</strong>
          </div>

          <input
            className={styles.range}
            type="range"
            min={0}
            max={100}
            step={1}
            value={minPopularity}
            onChange={(e) => onPopularityChange(Number(e.target.value))}
          />
        </div>

        <button className="btn btnSecondary" onClick={onClear}>
          Limpar filtros
        </button>
      </div>
    </section>
  );
}