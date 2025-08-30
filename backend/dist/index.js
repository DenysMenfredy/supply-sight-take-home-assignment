import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
const typeDefs = readFileSync("./src/schema.gql", { encoding: "utf-8" });
const products = [
    { id: "P-1001", name: "12mm Hex Bolt", sku: "HEX-12-100", warehouse: "BLR-A", stock: 180, demand: 120 },
    { id: "P-1002", name: "Steel Washer", sku: "WSR-08-500", warehouse: "BLR-A", stock: 50, demand: 80 },
    { id: "P-1003", name: "M8 Nut", sku: "NUT-08-200", warehouse: "PNQ-C", stock: 80, demand: 80 },
    { id: "P-1004", name: "10mm Hex Bolt", sku: "HEX-10-150", warehouse: "DEL-B", stock: 200, demand: 150 },
    { id: "P-1005", name: "Flat Washer 6mm", sku: "FWS-06-300", warehouse: "BLR-A", stock: 95, demand: 60 },
    { id: "P-1006", name: "M12 Lock Nut", sku: "LNT-12-180", warehouse: "MUM-D", stock: 120, demand: 140 },
    { id: "P-1007", name: "8mm Socket Head Screw", sku: "SHS-08-250", warehouse: "PNQ-C", stock: 75, demand: 90 },
    { id: "P-1008", name: "Spring Washer 10mm", sku: "SPW-10-400", warehouse: "DEL-B", stock: 160, demand: 100 },
    { id: "P-1009", name: "M6 Hex Bolt", sku: "HEX-06-220", warehouse: "BLR-A", stock: 240, demand: 180 },
    { id: "P-1010", name: "Rubber Gasket", sku: "RGS-15-120", warehouse: "MUM-D", stock: 45, demand: 65 },
    { id: "P-1011", name: "14mm Cap Screw", sku: "CAP-14-160", warehouse: "PNQ-C", stock: 110, demand: 125 },
    { id: "P-1012", name: "Split Pin 4mm", sku: "SPN-04-350", warehouse: "DEL-B", stock: 85, demand: 70 },
    { id: "P-1013", name: "M10 Flange Nut", sku: "FNT-10-190", warehouse: "BLR-A", stock: 140, demand: 160 },
    { id: "P-1014", name: "Thumb Screw 20mm", sku: "THM-20-110", warehouse: "MUM-D", stock: 60, demand: 45 },
    { id: "P-1015", name: "Wing Nut M12", sku: "WNG-12-280", warehouse: "PNQ-C", stock: 90, demand: 110 }
];
const warehouses = [
    { code: "BLR-A", name: "Bangalore - A", city: "Bangalore", country: "India" },
    { code: "DEL-B", name: "Delhi - B", city: "Delhi", country: "India" },
    { code: "PNQ-C", name: "Pune - C", city: "Pune", country: "India" },
    { code: "NYC-D", name: "New York - D", city: "New York", country: "USA" },
];
const kpis = [
    { date: "2025-08-01", stock: 334, demand: 400 },
    { date: "2025-08-11", stock: 300, demand: 350 },
    { date: "2025-07-30", stock: 150, demand: 300 },
    { date: "2025-08-21", stock: 50, demand: 40 },
    { date: "2025-08-13", stock: 334, demand: 400 },
    { date: "2025-08-15", stock: 300, demand: 350 },
    { date: "2025-08-20", stock: 280, demand: 300 },
    { date: "2025-08-24", stock: 250, demand: 280 },
    { date: "2025-08-14", stock: 334, demand: 400 },
    { date: "2025-08-15", stock: 300, demand: 350 },
    { date: "2025-08-27", stock: 280, demand: 300 },
    { date: "2025-08-23", stock: 120, demand: 110 },
];
const resolvers = {
    Query: {
        products: (_, { search, status, warehouse, page = 1, pageSize = 10 }) => {
            let filtered = products;
            if (search) {
                const s = search.toLowerCase();
                filtered = filtered.filter(p => p.name.toLowerCase().includes(s) ||
                    p.sku.toLowerCase().includes(s) ||
                    p.id.toLowerCase().includes(s));
            }
            if (warehouse) {
                filtered = filtered.filter(p => p.warehouse === warehouse);
            }
            if (status) {
                if (status === "Healthy") {
                    filtered = filtered.filter(p => p.stock > p.demand);
                }
                else if (status === "Low") {
                    filtered = filtered.filter(p => p.stock === p.demand);
                }
                else if (status === "Critical") {
                    filtered = filtered.filter(p => p.stock < p.demand);
                }
            }
            // Pagination: max 10 per page
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const total = filtered.length;
            const paginated = filtered.slice(start, end);
            return {
                items: paginated,
                totalCount: total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize),
            };
        },
        warehouses: () => warehouses,
        kpis: (_, { range }) => {
            if (!range)
                return kpis;
            // Get today's date
            const today = new Date();
            // Determine days to subtract based on range
            let days = 0;
            if (range === "7d")
                days = 7;
            else if (range === "14d")
                days = 14;
            else if (range === "30d")
                days = 30;
            if (days > 0) {
                const cutoff = new Date(today);
                cutoff.setDate(today.getDate() - days);
                // Filter kpis by date >= cutoff
                return kpis.filter(kpi => {
                    const kpiDate = new Date(kpi.date);
                    return kpiDate >= cutoff;
                });
            }
            // If range doesn't match, return all
            return kpis;
        },
    },
    Mutation: {
        updateDemand: (_, { id, demand }) => {
            const product = products.find(p => p.id === id);
            if (!product) {
                throw new Error(`Product with ID ${id} not found`);
            }
            product.demand = demand;
            return product;
        },
        transferStock: (_, { id, from, to, qty }) => {
            const productFrom = products.find(p => p.id === id && p.warehouse === from);
            const productTo = products.find(p => p.id === id && p.warehouse === to);
            if (!productFrom) {
                throw new Error(`Product with ID ${id} not found in warehouse ${from}`);
            }
            if (!productTo) {
                throw new Error(`Product with ID ${id} not found in warehouse ${to}`);
            }
            if (productFrom.stock < qty) {
                throw new Error(`Insufficient stock in warehouse ${from}`);
            }
            productFrom.stock -= qty;
            productTo.stock += qty;
            return productFrom;
        }
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
