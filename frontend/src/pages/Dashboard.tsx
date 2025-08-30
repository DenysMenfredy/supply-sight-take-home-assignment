import { useState, useEffect, useMemo } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { Product, Warehouse, KPI } from "../types/graphql";
import DateChip from "../components/DateChip";
import TrendChart from "../components/TrendChart";
import KPICards from "../components/KPICards";
import Filters from "../components/Filters";
import ProductsTable from "../components/ProducsTable";
import Drawer from "../components/Drawer";

const PAGE_SIZE = 10;

const GET_DASHBOARD = gql`
  query Dashboard($range: String!, $search: String, $status: String, $warehouse: String, $page: Int, $pageSize: Int) {
    warehouses { code name }
    kpis(range: $range) { date stock demand }
    products(search: $search, status: $status, warehouse: $warehouse, page: $page, pageSize: $pageSize) {
      items { id name sku warehouse stock demand },
      totalCount, totalPages, currentPage
    }
  }
`;

interface DashboardData {
  warehouses: Warehouse[];
  kpis: KPI[];
  products: {
    items: Product[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}

export default function Dashboard() {
  const [range, setRange] = useState("7d");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState<string | null>(null);
  const [warehouse, setWarehouse] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<Product | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim() || null), 250);
    return () => clearTimeout(id);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, warehouse, status, range]);

  const { data, loading, error, refetch } = useQuery<DashboardData>(GET_DASHBOARD, {
    variables: {
      range,
      search: debouncedSearch,
      status: status !== "All" ? status : null,
      warehouse: warehouse || null,
      page,
      pageSize: PAGE_SIZE,
    }
  });

  const productsData = data?.products;
  const products = useMemo(() => productsData?.items || [], [productsData]);
  const warehouses = data?.warehouses || [];
  const kpis = data?.kpis || [];
  const totalCount = productsData?.totalCount || 0;
  const totalPages = productsData?.totalPages || 1;
  const currentPage = productsData?.currentPage || page;

  const totals = useMemo(() => {
    const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
    const totalDemand = products.reduce((s, p) => s + (p.demand || 0), 0);
    const satisfied = products.reduce((s, p) => s + Math.min(p.stock || 0, p.demand || 0), 0);
    const fillRate = totalDemand > 0 ? (satisfied / totalDemand) * 100 : 0;
    return { totalStock, totalDemand, fillRate };
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight text-black">SupplySight</div>
          <div className="flex items-center gap-2">
            <DateChip
              label="7d"
              value="7d"
              active={range === "7d"}
              onClick={(v) => {
                setRange(v);
                refetch({
                  range: v,
                  search: debouncedSearch,
                  status: status !== "All" ? status : null,
                  warehouse: warehouse || null,
                  page,
                  pageSize: PAGE_SIZE,
                });
              }}
            />
            <DateChip
              label="14d"
              value="14d"
              active={range === "14d"}
              onClick={(v) => {
                setRange(v);
                refetch({
                  range: v,
                  search: debouncedSearch,
                  status: status !== "All" ? status : null,
                  warehouse: warehouse || null,
                  page,
                  pageSize: PAGE_SIZE,
                });
              }}
            />
            <DateChip
              label="30d"
              value="30d"
              active={range === "30d"}
              onClick={(v) => {
                setRange(v);
                refetch({
                  range: v,
                  search: debouncedSearch,
                  status: status !== "All" ? status : null,
                  warehouse: warehouse || null,
                  page,
                  pageSize: PAGE_SIZE,
                });
              }}
            />
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-6 space-y-6">
        <KPICards totals={totals} />
        <TrendChart data={kpis} />
        <Filters {...{ search, setSearch, warehouse, setWarehouse, warehouses, status, setStatus }} />
        <ProductsTable
          products={products}
          onRowClick={setSelected}
          page={currentPage}
          setPage={setPage}
          total={totalCount}
          pageSize={PAGE_SIZE}
          totalPages={totalPages}
        />
        {loading && <div className="text-center text-black">Loading…</div>}
        {error && <div className="text-center text-red-600">{error.message}</div>}
      </main>

      <Drawer open={!!selected} onClose={() => setSelected(null)} product={selected} warehouses={warehouses} onUpdated={() => { setSelected(null); refetch(); }} />
    </div>
  );
}
