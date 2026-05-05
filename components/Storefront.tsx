"use client";

import { useMemo, useState } from "react";
import type { Product } from "../lib/types";

type StorefrontProps = {
  initialProducts: Product[];
};

export function Storefront({ initialProducts }: StorefrontProps) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [initialProducts, search]);

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar produto"
      />

      <div>
        {filteredProducts.map((product) => (
          <div key={product.id}>{product.title}</div>
        ))}
      </div>
    </div>
  );
}