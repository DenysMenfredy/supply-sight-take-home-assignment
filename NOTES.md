
# NOTES

## Decisions Made
- **Technology stack**: Used React with TypeScript and Vite, Apollo Client, and TailwindCSS. This ensured type safety, fast styling, and easy GraphQL integration. In the backend also used Apollo to create a server.
- **Componentization**: Split UI into reusable components (`KPICards`, `TrendChart`, `Filters`, `ProductsTable`, `Drawer`) to keep code modular and maintainable.
- **GraphQL client separation**: Created a dedicated `apollo/client.ts` for a clean separation of concerns and easier testing.
- **Responsiveness**: Used TailwindCSS utilities with fluid layouts (`w-full`, responsive grids) to make the dashboard adapt across screen sizes.
- **Status calculation**: Added a helper to classify products as Healthy, Low, or Critical, to give immediate insight into inventory health.

## Trade-offs
- **Manual types**: Defined TypeScript interfaces (`Product`, `Warehouse`, `KPI`) by hand instead of generating from GraphQL schema. Faster to implement but less future-proof if schema evolves.
- **Basic pagination**: Implemented client-side pagination for products. This works with small datasets but won’t scale for large product catalogs.
- **Minimal validation**: Forms in `Drawer` have only basic validation (e.g., min values). Stronger validation could prevent more edge cases.

## Improvements With More Time
- **GraphQL Codegen**: Use `graphql-code-generator` to auto-generate hooks and TypeScript types directly from schema for safer integration.
- **Server-side pagination & filtering**: Move product pagination and filtering to the backend for scalability.
- **Unit & integration tests**: Add Jest/React Testing Library tests for components and Apollo queries to ensure reliability.
- **Design polish**: Introduce animations, skeleton loaders, and refined color palettes for a more polished UX.
- **Error handling**: Improve error boundaries and mutation error messages in `Drawer` for clearer user feedback.
- **Authentication & roles**: Secure operations (e.g., stock transfer) with auth/role checks if extended to real-world use.
