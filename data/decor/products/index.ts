import type { Product } from "@/types";
import { rugsProducts } from "./rugs";
import { cushionsProducts } from "./cushions";
import { vasesProducts } from "./vases";
import { wallArtProducts } from "./wall-art";
import { lampsProducts } from "./lamps";

export const decorProducts: Product[] = [
  ...rugsProducts,
  ...cushionsProducts,
  ...vasesProducts,
  ...wallArtProducts,
  ...lampsProducts,
];
