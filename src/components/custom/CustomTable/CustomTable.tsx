import * as React from "react";
import { cn } from "./cn";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Primitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | Record<string, unknown>;

export type ColumnDef<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
  searchable?: boolean;
  cellClassName?: string;
};

export type DataTableProps<T extends Record<string, Primitive>> = {
  data: T[];
  columns: Array<ColumnDef<T>>;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  exportFileName?: string;
  className?: string;
  getRowId?: (row: T, index: number) => string | number;
  filterControls?: React.ReactNode;
  /** Optional custom action (e.g., button) shown in the header next to export. */
  actionComponent?: React.ReactNode;

  /** New: enable the dropdown suggestions next to the normal search */
  enableSearchDropdown?: boolean;
  /** New: build a human friendly label per suggestion (defaults to concatenated searchable values) */
  buildSuggestionLabel?: (row: T) => string;
  /** New: when a suggestion is chosen (optional) */
  onSuggestionSelect?: (row: T) => void;
  /** New: max suggestions to show (default 8) */
  maxSuggestions?: number;
  /** New: when a row gets highlighted because we jumped to it */
  highlightClassName?: string; // default "ring-2 ring-indigo-400"
};

function toCSVValue(v: unknown) {
  if (v == null) return "";
  const text =
    v instanceof Date
      ? v.toISOString()
      : typeof v === "object"
      ? JSON.stringify(v)
      : String(v);
  const needsWrap = /[",\n]/.test(text);
  return needsWrap ? `"${text.replace(/"/g, '""')}"` : text;
}

function downloadCSV(fileName: string, rows: string[]) {
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataTable<T extends Record<string, Primitive>>(props: DataTableProps<T>) {
  const {
    data,
    columns,
    defaultPageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    exportFileName = "export.csv",
    className,
    getRowId,
    filterControls,
    actionComponent,

    // new props
    enableSearchDropdown = false,
    buildSuggestionLabel,
    onSuggestionSelect,
    maxSuggestions = 8,
    highlightClassName = "ring-2 ring-indigo-400",
  } = props;

  const [search, setSearch] = React.useState("");
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const searchableColumns = React.useMemo(
    () => columns.filter((c) => c.searchable !== false),
    [columns]
  );

  const normalizedText = (v: unknown) => {
    if (v instanceof Date) return v.toISOString();
    if (v == null) return "";
    return String(v);
  };

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return data.filter((row) => {
      if (!query) return true;
      return searchableColumns.some((c) => {
        const text = normalizedText(row[c.key]);
        return text.toLowerCase().includes(query);
      });
    });
  }, [data, search, searchableColumns]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const exportCurrentView = () => {
    const header = columns.map((c) => toCSVValue(c.header)).join(",");
    const lines = pageRows.map((row) =>
      columns
        .map((c) => {
          const value = c.render ? c.render(row) : row[c.key];
          if (typeof value === "string" || typeof value === "number")
            return toCSVValue(value);
          return toCSVValue(row[c.key]);
        })
        .join(",")
    );
    downloadCSV(exportFileName, [header, ...lines]);
  };

  // ---------- Suggestions (typeahead) ----------
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [highlightedId, setHighlightedId] = React.useState<string | number | null>(null);

  // Build label for each row (default: join searchable column values)
  const defaultLabelBuilder = React.useCallback(
    (row: T) => {
      const parts = searchableColumns
        .map((c) => normalizedText(row[c.key]))
        .filter(Boolean);
      return parts.join(" • ");
    },
    [searchableColumns]
  );

  const suggestionLabel = buildSuggestionLabel ?? defaultLabelBuilder;

  const suggestions = React.useMemo(() => {
    if (!enableSearchDropdown) return [];
    const q = search.trim().toLowerCase();
    if (!q) return [];
    // rank: first by whether label startsWith query, then includes
    const scored = data
      .map((row, idx) => {
        const label = suggestionLabel(row);
        const lower = label.toLowerCase();
        if (!lower.includes(q)) return null;
        const starts = lower.startsWith(q) ? 0 : 1;
        return { row, idx, label, score: starts };
      })
      .filter(Boolean) as Array<{ row: T; idx: number; label: string; score: number }>;

    scored.sort((a, b) => a.score - b.score || a.label.localeCompare(b.label));
    return scored.slice(0, maxSuggestions);
  }, [enableSearchDropdown, search, data, maxSuggestions, suggestionLabel]);

  // Close on outside click
  React.useEffect(() => {
    if (!enableSearchDropdown) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [enableSearchDropdown]);

  const jumpToRow = React.useCallback(
    (absoluteIndex: number, row: T) => {
      const targetPage = Math.max(1, Math.ceil((absoluteIndex + 1) / pageSize));
      setPage(targetPage);

      // compute the id to highlight on the target page
      const id =
        getRowId?.(row, absoluteIndex) ??
        (String(absoluteIndex) as string | number);
      setHighlightedId(id);

      // remove highlight after a short delay
      window.setTimeout(() => setHighlightedId(null), 1600);
    },
    [getRowId, pageSize]
  );

  const selectSuggestion = React.useCallback(
    (s: { row: T; idx: number; label: string }) => {
      setSearch(s.label); // normal search still works
      setShowSuggestions(false);
      setActiveIndex(-1);

      // jump and highlight
      jumpToRow(s.idx, s.row);

      // optional external handler (e.g., open modal immediately)
      onSuggestionSelect?.(s.row);
    },
    [jumpToRow, onSuggestionSelect]
  );


  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white shadow-md", className)} ref={containerRef}>
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 rounded-t-lg">
        <div className="relative w-full max-w-sm">
          <CustomInput
            label=""
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              if (enableSearchDropdown) setShowSuggestions(true);
            }}
            placeholder="Search..."
            className="mb-0"
          />
          {enableSearchDropdown && showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
              <ul className="max-h-72 overflow-auto py-1 text-sm">
                {suggestions.map((s, i) => (
                  <li
                    key={(getRowId?.(s.row, s.idx) ?? s.label) as React.Key}
                    className={cn(
                      "cursor-pointer px-3 py-2 hover:bg-slate-50",
                      i === activeIndex && "bg-slate-100"
                    )}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(-1)}
                    onClick={() => selectSuggestion({ row: s.row, idx: s.idx, label: s.label })}
                  >
                    <div className="truncate text-slate-800">{s.label}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {filterControls}
          {actionComponent}
          <CustomButton
            fullWidth={false}
            size="sm"
            variant="outline"
            onClick={exportCurrentView}
          >
            Export
          </CustomButton>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              {columns.map((c, idx) => (
                <th
                  key={String(c.key) + idx}
                  className={cn("px-6 py-3 font-medium", c.cellClassName)}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pageRows.length > 0 ? (
              pageRows.map((row, i) => {
                const absoluteIndex = start + i;
                const id =
                  getRowId?.(row, absoluteIndex) ?? `${absoluteIndex}`;
                const isHighlighted = highlightedId === id;
                return (
                  <tr
                    key={id}
                    className={cn(
                      "bg-white hover:bg-slate-50 transition-colors",
                      isHighlighted && highlightClassName
                    )}
                  >
                    {columns.map((c, ci) => {
                      const content = c.render
                        ? c.render(row)
                        : (row[c.key] as React.ReactNode);
                      return (
                        <td
                          key={String(c.key) + ci}
                          className={cn(
                            "whitespace-nowrap px-6 py-4 text-slate-700",
                            c.cellClassName
                          )}
                        >
                          {content ?? ""}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4 bg-white border-t border-slate-200 rounded-b-lg">
        <div className="text-sm text-slate-600">
          Showing <span className="font-medium">{total === 0 ? 0 : start + 1}</span> to{" "}
          <span className="font-medium">{start + pageRows.length}</span> of{" "}
          <span className="font-medium">{total}</span> results
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-md border-slate-300 text-sm py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {pageSizeOptions.map((ps) => (
                <option key={ps} value={ps}>
                  {ps}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={clampedPage === 1}
              className="flex items-center justify-center h-9 w-9 text-sm border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-sm text-slate-600">
              Page <span className="font-medium">{clampedPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={clampedPage === totalPages}
              className="flex items-center justify-center h-9 w-9 text-sm border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
