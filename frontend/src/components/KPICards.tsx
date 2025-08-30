import React from "react";

interface Totals {
  totalStock: number;
  totalDemand: number;
  fillRate: number;
}

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

export default function KPICards({ totals }: { totals: Totals }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      <div className="bg-white rounded-2xl p-4 border shadow-sm">
        <div className="text-sm text-black">Total Stock</div>
        <div className="text-2xl font-semibold mt-1 text-black">{formatNumber(totals.totalStock)}</div>
      </div>
      <div className="bg-white rounded-2xl p-4 border shadow-sm">
        <div className="text-sm text-black">Total Demand</div>
        <div className="text-2xl font-semibold mt-1 text-black">{formatNumber(totals.totalDemand)}</div>
      </div>
      <div className="bg-white rounded-2xl p-4 border shadow-sm">
        <div className="text-sm text-black">Fill Rate</div>
        <div className="text-2xl font-semibold mt-1 text-black">{totals.fillRate.toFixed(1)}%</div>
      </div>
    </section>
  );
}
