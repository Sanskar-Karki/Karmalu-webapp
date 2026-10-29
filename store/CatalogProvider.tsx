"use client";

import { createContext, useContext, useMemo } from "react";
import { createCatalog, type Catalog, type CatalogData } from "@/data/catalog";

const CatalogContext = createContext<Catalog | null>(null);

/** Makes the server-loaded catalogue available to client components. */
export function CatalogProvider({
  data,
  children,
}: {
  data: CatalogData;
  children: React.ReactNode;
}) {
  const catalog = useMemo(() => createCatalog(data), [data]);
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): Catalog {
  const catalog = useContext(CatalogContext);
  if (!catalog) throw new Error("useCatalog must be used inside <CatalogProvider>");
  return catalog;
}
