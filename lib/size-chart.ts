/**
 * Size charts: any measurement columns, one row per size, in inches or cm.
 *
 * Stored shape: { unit: "in", columns: ["Chest", "Length"], rows: [{ size: "M", values: [38, 27] }] }.
 * Charts saved without a unit (the original built-in data, which used
 * [{ size, chest, waist, hip }], and early admin charts) were entered in cm —
 * `normalizeSizeChart` reads all of them, so older products keep working.
 */

export type SizeUnit = "in" | "cm";

export interface SizeChart {
  /** The unit the numbers were entered in. */
  unit: SizeUnit;
  columns: string[];
  rows: { size: string; values: (number | null)[] }[];
}

/** The original fixed-column format (built-in product data, early database rows). */
export type LegacySizeChartRow = { size: string; chest: number; waist: number; hip: number };

export type StoredSizeChart = SizeChart | Omit<SizeChart, "unit"> | LegacySizeChartRow[];

/** Unit new charts are filled in with. */
export const DEFAULT_UNIT: SizeUnit = "in";
/** Columns a new size chart starts with. */
export const DEFAULT_COLUMNS = ["Chest", "Length", "Sleeves"];
/** Columns of the original fixed format — only used to read old charts. */
const LEGACY_COLUMNS = ["Chest", "Waist", "Hip"];
export const MAX_COLUMNS = 8;

const CM_PER_INCH = 2.54;

/** Quick column sets for common garments. */
export const COLUMN_PRESETS: { label: string; columns: string[] }[] = [
  { label: "Chest · Length · Sleeves", columns: DEFAULT_COLUMNS },
  { label: "Tops", columns: ["Chest", "Length", "Shoulder", "Sleeves"] },
  { label: "Bottoms", columns: ["Waist", "Hip", "Inseam", "Length"] },
  { label: "Chest · Waist · Hip", columns: LEGACY_COLUMNS },
];

const toNumber = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/** Reads any stored format into a SizeChart (null when there's nothing). */
export function normalizeSizeChart(raw: unknown): SizeChart | null {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    if (raw.length === 0) return null;
    return {
      unit: "cm",
      columns: [...LEGACY_COLUMNS],
      rows: (raw as LegacySizeChartRow[]).map((r) => ({
        size: String(r.size),
        values: [toNumber(r.chest), toNumber(r.waist), toNumber(r.hip)],
      })),
    };
  }
  const c = raw as Partial<SizeChart>;
  if (!Array.isArray(c.columns) || !Array.isArray(c.rows)) return null;
  const columns = c.columns.map(String);
  return {
    // No unit saved = entered before units existed, when the admin used cm.
    unit: c.unit === "in" ? "in" : "cm",
    columns,
    rows: c.rows.map((r) => ({
      size: String(r.size),
      values: columns.map((_, i) => toNumber(r.values?.[i])),
    })),
  };
}

/** True when at least one measurement has been filled in. */
export function hasMeasurements(chart: SizeChart | null | undefined): chart is SizeChart {
  return Boolean(chart?.rows.some((r) => r.values.some((v) => v !== null)));
}

/** Converts a measurement between units (1 decimal place). */
export function convertMeasurement(value: number, from: SizeUnit, to: SizeUnit): number {
  if (from === to) return value;
  const converted = from === "cm" ? value / CM_PER_INCH : value * CM_PER_INCH;
  return Math.round(converted * 10) / 10;
}

/** The same chart with every number converted to `unit`. */
export function convertSizeChart(chart: SizeChart, unit: SizeUnit): SizeChart {
  if (chart.unit === unit) return chart;
  return {
    unit,
    columns: chart.columns,
    rows: chart.rows.map((r) => ({
      size: r.size,
      values: r.values.map((v) => (v === null ? null : convertMeasurement(v, chart.unit, unit))),
    })),
  };
}

/**
 * Makes the chart's rows match `sizes` (same order). Rows for removed sizes
 * are dropped; their numbers are kept in `cache` so re-selecting restores them.
 */
export function syncRows(
  chart: SizeChart,
  sizes: string[],
  cache?: Map<string, (number | null)[]>,
): SizeChart {
  const existing = new Map(chart.rows.map((r) => [r.size, r.values]));
  for (const [size, values] of existing) if (!sizes.includes(size)) cache?.set(size, values);
  const blank = () => chart.columns.map(() => null);
  return {
    unit: chart.unit,
    columns: chart.columns,
    rows: sizes.map((size) => {
      const values = existing.get(size) ?? cache?.get(size) ?? blank();
      // Columns may have changed while the row was cached.
      return { size, values: chart.columns.map((_, i) => values[i] ?? null) };
    }),
  };
}

/** An empty chart (default unit and columns) with a row for each size. */
export function emptySizeChart(sizes: string[] = []): SizeChart {
  return syncRows({ unit: DEFAULT_UNIT, columns: [...DEFAULT_COLUMNS], rows: [] }, sizes);
}
