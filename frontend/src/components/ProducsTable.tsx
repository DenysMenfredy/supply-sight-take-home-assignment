import React from "react";
import type { Product } from "../types/graphql";

interface ProductsTableProps {
  products: Product[];
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
  onRowClick: (p: Product) => void;
  setPage: (page: number) => void;
}

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

function statusFrom(stock: number, demand: number) {
  if (stock > demand) return { label: "Healthy", tone: "bg-green-100 text-green-800", row: "" };
  if (stock === demand) return { label: "Low", tone: "bg-yellow-100 text-yellow-800", row: "" };
  return { label: "Critical", tone: "bg-red-100 text-red-800", row: "bg-red-50" };
}

export default function ProductsTable({
  products,
  page,
  pageSize,
  total,
  totalPages: totalPagesProp,
  onRowClick,
  setPage,
}: ProductsTableProps) {
  // Use totalPages from prop if provided, otherwise calculate from total/pageSize
  const totalPages = totalPagesProp ?? Math.max(1, Math.ceil((total || 0) / pageSize));
  // No need to slice products here, as backend already paginates and returns only current page's items
  const pageData = products || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-black">
            <tr>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3">SKU</th>
              <th className="text-left px-4 py-3">Warehouse</th>
              <th className="text-right px-4 py-3">Stock</th>
              <th className="text-right px-4 py-3">Demand</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((p) => {
              const s = statusFrom(p.stock, p.demand);
              return (
                <tr
                  key={p.id}
                  className={`${s.row} hover:bg-gray-100 cursor-pointer`}
                  onClick={() => onRowClick(p)}
                >
                  <td className="px-4 py-3 text-black">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-black">{p.sku}</td>
                  <td className="px-4 py-3 font-mono text-black">{p.warehouse}</td>
                  <td className="px-4 py-3 text-right text-black">{formatNumber(p.stock)}</td>
                  <td className="px-4 py-3 text-right text-black">{formatNumber(p.demand)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.tone}`}>
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-black">No results</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-3 border-t bg-gray-50 rounded-b-2xl">
        <div className="text-sm text-black">
          Page {page} of {totalPages}
        </div>
        <div className="space-x-2">
          <button
            className="px-3 py-1.5 rounded-lg border bg-white disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            className="px-3 py-1.5 rounded-lg border bg-white disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
