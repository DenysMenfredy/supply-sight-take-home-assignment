import React from "react";
import type { Warehouse } from "../types/graphql";

interface FiltersProps {
  search: string;
  setSearch: (s: string) => void;
  warehouse: string;
  setWarehouse: (w: string) => void;
  warehouses: Warehouse[];
  status: string;
  setStatus: (s: string) => void;
}

export default function Filters({
  search,
  setSearch,
  warehouse,
  setWarehouse,
  warehouses,
  status,
  setStatus,
}: FiltersProps) {
  return (
    <section className="bg-white rounded-2xl p-4 border shadow-sm w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm text-black mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, ID…"
            className="w-full border rounded-xl px-3 py-2 text-black"
          />
        </div>
        <div>
          <label className="block text-sm text-black mb-1">Warehouse</label>
          <select
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 bg-white text-black"
          >
            <option value="">All</option>
            {warehouses.map((w) => (
              <option key={w.code} value={w.code}>
                {w.code} — {w.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-black mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 bg-white text-black"
          >
            <option>All</option>
            <option>Healthy</option>
            <option>Low</option>
            <option>Critical</option>
          </select>
        </div>
      </div>
    </section>
  );
}
