import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast"; // <-- Add this import
import type { Product, Warehouse } from "../types/graphql";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  warehouses: Warehouse[];
  onUpdated: () => void;
}

const UPDATE_DEMAND = gql`
  mutation UpdateDemand($id: ID!, $demand: Int!) {
    updateDemand(id: $id, demand: $demand) { id demand stock warehouse name sku }
  }
`;

const TRANSFER_STOCK = gql`
  mutation TransferStock($id: ID!, $from: String!, $to: String!, $qty: Int!) {
    transferStock(id: $id, from: $from, to: $to, qty: $qty) { id stock warehouse name sku demand }
  }
`;

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

export default function Drawer({ open, onClose, product, warehouses, onUpdated }: DrawerProps) {
  const [demand, setDemand] = useState(0);
  const [to, setTo] = useState("");
  const [qty, setQty] = useState(0);

  const [updateDemand, { loading: updatingDemand }] = useMutation(UPDATE_DEMAND, {
    onCompleted: () => {
      toast.success("Demand updated successfully!");
      onUpdated();
    },
    onError: (err) => {
      toast.error(`Failed to update demand: ${err.message}`);
    },
  });

  const [transferStock, { loading: transferring }] = useMutation(TRANSFER_STOCK, {
    onCompleted: () => {
      toast.success("Stock transferred successfully!");
      onUpdated();
    },
    onError: (err) => {
      toast.error(`Failed to transfer stock: ${err.message}`);
    },
  });

  useEffect(() => {
    if (product) {
      setDemand(product.demand);
      const fallback = (warehouses || []).find((w) => w.code !== product.warehouse)?.code || "";
      setTo(fallback);
      setQty(0);
    }
  }, [product, warehouses]);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[440px] bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <button className="p-2 rounded hover:bg-gray-100" onClick={onClose}>✕</button>
        </div>

        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-500">ID</div>
          <div className="font-mono text-sm">{product.id}</div>
          <div className="text-sm text-gray-500">Name</div>
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-gray-500">SKU</div>
          <div className="font-mono text-sm">{product.sku}</div>
          <div className="text-sm text-gray-500">Warehouse</div>
          <div className="font-mono text-sm">{product.warehouse}</div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="p-3 bg-gray-50 rounded-xl border">
              <div className="text-xs text-gray-500">Stock</div>
              <div className="text-lg font-semibold">{formatNumber(product.stock)}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border">
              <div className="text-xs text-gray-500">Demand</div>
              <div className="text-lg font-semibold">{formatNumber(product.demand)}</div>
            </div>
          </div>
        </div>

        {/* Update Demand */}
        <div className="mt-8">
          <h3 className="font-semibold mb-3">Update Demand</h3>
          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              await updateDemand({ variables: { id: product.id, demand: Math.max(0, Number(demand) || 0) } });
            }}
          >
            <input
              type="number"
              value={demand}
              onChange={(e) => setDemand(Number(e.target.value))}
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring focus:ring-gray-200"
              min={0}
            />
            <button
              type="submit"
              disabled={updatingDemand}
              className="px-4 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-60"
            >
              {updatingDemand ? "Updating…" : "Save"}
            </button>
          </form>
        </div>

        {/* Transfer Stock */}
        <div className="mt-8">
          <h3 className="font-semibold mb-3">Transfer Stock</h3>
          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!to || to === product.warehouse) return;
              const amount = Math.max(1, Number(qty) || 0);
              await transferStock({ variables: { id: product.id, from: product.warehouse, to, qty: amount } });
            }}
          >
            <div>
              <label className="block text-sm text-gray-600 mb-1">To Warehouse</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 bg-white"
              >
                <option value="" disabled>Select…</option>
                {(warehouses || []).filter((w) => w.code !== product.warehouse).map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code} — {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full border rounded-xl px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={transferring || !to}
              className="px-4 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-60"
            >
              {transferring ? "Transferring…" : "Transfer"}
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
