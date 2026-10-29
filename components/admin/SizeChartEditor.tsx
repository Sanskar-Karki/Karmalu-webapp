"use client";

import { COLUMN_PRESETS, convertSizeChart, MAX_COLUMNS, type SizeChart, type SizeUnit } from "@/lib/size-chart";
import { buttonSecondary } from "@/lib/admin-ui";

const cell =
  "w-full min-w-0 rounded-lg border border-black/12 bg-white px-2.5 py-2 text-sm outline-none transition focus:border-[#59634a] focus:shadow-[0_0_0_3px_rgba(89,99,74,0.15)]";

/**
 * Editable size chart. Rows mirror the selected sizes (managed by the form);
 * columns can be added, renamed, removed, or replaced with a preset.
 */
export default function SizeChartEditor({
  chart,
  onChange,
  onRemoveSize,
}: {
  chart: SizeChart;
  onChange: (chart: SizeChart) => void;
  /** Removing a row deselects that size. */
  onRemoveSize: (size: string) => void;
}) {
  const { columns, rows } = chart;

  const setValue = (r: number, c: number, raw: string) => {
    const n = raw === "" ? null : Number(raw);
    onChange({
      unit: chart.unit,
      columns,
      rows: rows.map((row, i) => (i === r ? { ...row, values: row.values.map((v, j) => (j === c ? (Number.isFinite(n) ? n : null) : v)) } : row)),
    });
  };

  const renameColumn = (c: number, name: string) => onChange({ unit: chart.unit, columns: columns.map((col, i) => (i === c ? name : col)), rows });

  const addColumn = () => {
    if (columns.length >= MAX_COLUMNS) return;
    let name = "Measurement";
    for (let n = 2; columns.some((col) => col.toLowerCase() === name.toLowerCase()); n++) name = `Measurement ${n}`;
    onChange({ unit: chart.unit, columns: [...columns, name], rows: rows.map((r) => ({ ...r, values: [...r.values, null] })) });
  };

  const removeColumn = (c: number) => {
    if (columns.length <= 1) return;
    onChange({
      unit: chart.unit,
      columns: columns.filter((_, i) => i !== c),
      rows: rows.map((r) => ({ ...r, values: r.values.filter((_, i) => i !== c) })),
    });
  };

  const moveColumn = (c: number, dir: -1 | 1) => {
    const to = c + dir;
    if (to < 0 || to >= columns.length) return;
    const swap = <T,>(arr: T[]) => {
      const next = [...arr];
      [next[c], next[to]] = [next[to], next[c]];
      return next;
    };
    onChange({ unit: chart.unit, columns: swap(columns), rows: rows.map((r) => ({ ...r, values: swap(r.values) })) });
  };

  /** Switch to a preset, keeping numbers for columns with the same name. */
  const applyPreset = (preset: string[]) => {
    const index = new Map(columns.map((col, i) => [col.trim().toLowerCase(), i]));
    onChange({
      unit: chart.unit,
      columns: [...preset],
      rows: rows.map((r) => ({
        ...r,
        values: preset.map((col) => {
          const i = index.get(col.toLowerCase());
          return i === undefined ? null : r.values[i];
        }),
      })),
    });
  };

  const duplicateNames = new Set(
    columns.map((c) => c.trim().toLowerCase()).filter((c, i, all) => c && all.indexOf(c) !== i),
  );

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/15 px-5 py-6 text-center text-sm text-black/50">
        Select sizes above — a row is added here for each one.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-black/55">
          Measurements in <strong>{chart.unit === "in" ? "inches" : "centimetres"}</strong>
        </p>
        <div role="radiogroup" aria-label="Measurement unit" className="flex rounded-xl bg-black/[0.05] p-1">
          {(["in", "cm"] as SizeUnit[]).map((u) => (
            <button
              key={u}
              type="button"
              role="radio"
              aria-checked={chart.unit === u}
              onClick={() => onChange(convertSizeChart(chart, u))}
              title={chart.unit === u ? undefined : `Switch to ${u === "in" ? "inches" : "cm"} (converts the numbers)`}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                chart.unit === u ? "bg-white text-[#14100f] shadow-sm" : "text-black/50 hover:text-black"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-black/[0.07]">
        <table className="w-full border-collapse text-sm" style={{ minWidth: 140 + columns.length * 120 }}>
          <thead>
            <tr className="bg-black/[0.025]">
              <th className="w-24 px-3 py-2.5 text-left text-xs font-medium text-black/50">Size</th>
              {columns.map((col, c) => (
                <th key={c} className="px-1.5 py-2 align-top">
                  <div className="flex items-center gap-0.5">
                    <input
                      aria-label={`Column ${c + 1} name`}
                      value={col}
                      onChange={(e) => renameColumn(c, e.target.value)}
                      className={`${cell} font-medium ${!col.trim() || duplicateNames.has(col.trim().toLowerCase()) ? "border-red-300 bg-red-50/50" : ""}`}
                      placeholder="Name"
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-0.5 text-[11px] text-black/40">
                    <button type="button" aria-label={`Move ${col || "column"} left`} disabled={c === 0} onClick={() => moveColumn(c, -1)} className="rounded px-1.5 py-0.5 hover:bg-black/5 hover:text-black disabled:opacity-25">
                      ←
                    </button>
                    <button type="button" aria-label={`Move ${col || "column"} right`} disabled={c === columns.length - 1} onClick={() => moveColumn(c, 1)} className="rounded px-1.5 py-0.5 hover:bg-black/5 hover:text-black disabled:opacity-25">
                      →
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${col || "column"} column`}
                      disabled={columns.length <= 1}
                      onClick={() => removeColumn(c)}
                      className="rounded px-1.5 py-0.5 text-red-500 hover:bg-red-50 disabled:opacity-25"
                    >
                      ✕
                    </button>
                  </div>
                </th>
              ))}
              <th className="w-10 px-1.5 py-2 align-top">
                <button
                  type="button"
                  onClick={addColumn}
                  disabled={columns.length >= MAX_COLUMNS}
                  aria-label="Add column"
                  title={columns.length >= MAX_COLUMNS ? `Up to ${MAX_COLUMNS} columns` : "Add column"}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-black/20 text-black/50 transition hover:border-[#59634a] hover:text-[#59634a] disabled:opacity-30"
                >
                  +
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={row.size} className="border-t border-black/[0.05]">
                <td className="px-3 py-1.5">
                  <span className="inline-flex min-w-9 items-center justify-center rounded-lg bg-[#14100f] px-2 py-1 text-xs font-semibold text-white">
                    {row.size}
                  </span>
                </td>
                {columns.map((col, c) => (
                  <td key={c} className="px-1.5 py-1.5">
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        aria-label={`${col || `Column ${c + 1}`} for size ${row.size}`}
                        value={row.values[c] ?? ""}
                        onChange={(e) => setValue(r, c, e.target.value)}
                        placeholder="—"
                        className={`${cell} pr-8 tabular-nums`}
                      />
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-black/35">{chart.unit}</span>
                    </div>
                  </td>
                ))}
                <td className="px-1.5 py-1.5 text-center">
                  <button
                    type="button"
                    aria-label={`Remove size ${row.size}`}
                    title="Remove this size"
                    onClick={() => onRemoveSize(row.size)}
                    className="rounded-lg px-2 py-1 text-black/35 transition hover:bg-red-50 hover:text-red-600"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-black/45">Column presets:</span>
        {COLUMN_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => applyPreset(preset.columns)}
            className="rounded-full border border-black/12 px-3 py-1 text-xs font-medium transition hover:border-black/40"
            title={preset.columns.join(" · ")}
          >
            {preset.label}
          </button>
        ))}
        <button type="button" onClick={addColumn} disabled={columns.length >= MAX_COLUMNS} className={`${buttonSecondary} ml-auto !py-1.5 text-xs`}>
          + Add column
        </button>
      </div>
      <p className="text-[11px] text-black/45">
        Rows follow the sizes selected above. Leave a box empty if it doesn&apos;t apply — shoppers see “—”. The size
        guide only appears on the product page once at least one measurement is filled in.
      </p>
    </div>
  );
}
