import type { Product } from "@/types";
import { menProducts } from "./men";
import { womenProducts } from "./women";
import { accessoriesProducts } from "./accessories";

export const activewearProducts: Product[] = [
  ...menProducts,
  ...womenProducts,
  ...accessoriesProducts,
];
