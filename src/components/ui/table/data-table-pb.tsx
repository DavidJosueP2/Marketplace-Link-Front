import React from "react";
import type {
  ColumnDef,
  FilterFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/shadcn/table";

type ControlledState = {
  pagination: PaginationState;
};

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  initialPageSize?: number;
  searchable?: boolean;
  globalFilterFn?: FilterFn<TData>;
  selectable?: boolean;
  onSelectionChange?: (rows: TData[]) => void;
  rowActions?: (row: Row<TData>) => React.ReactNode;
  actionsHeader?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
  manualPagination?: boolean;
  pageCount?: number;
  totalRows?: number;
  state?: ControlledState;
  onPaginationChange?: (pagination: PaginationState) => void;
};

type ColumnDefWithSize<TData> = ColumnDef<TData, unknown> & {
  size?: number;
};

type SortDirection = "asc" | "desc" | false | undefined;

/**
 * DataTable - Wrapper de TanStack Table con shadcn/ui
 */
export default function DataTable<TData>({
  columns,
  data,
  initialPageSize = 5,
  searchable = true,
  globalFilterFn,
  selectable = false,
  onSelectionChange,
  rowActions,
  actionsHeader,
  emptyMessage = "Sin datos",
  className,
  manualPagination = false,
  pageCount,
  totalRows,
  state,
  onPaginationChange,
}: Readonly<DataTableProps<TData>>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const controlledPagination = state?.pagination;

  const selectionColumn = React.useMemo<ColumnDef<TData, unknown>[]>(() => {
    if (!selectable) return [];

    return [
      {
        id: "__select__",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Seleccionar pagina"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Seleccionar fila"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 48,
      },
    ];
  }, [selectable]);

  const actionsColumn = React.useMemo<ColumnDef<TData, unknown>[]>(() => {
    if (!rowActions) return [];

    return [
      {
        id: "__actions__",
        header: () =>
          actionsHeader ? (
            <span className="font-semibold uppercase tracking-wide text-[color:var(--muted-foreground)] opacity-80">
              {typeof actionsHeader === "string"
                ? actionsHeader.toUpperCase()
                : actionsHeader}
            </span>
          ) : (
            <span className="sr-only">Acciones</span>
          ),
        cell: ({ row }) => (
          <div className="flex items-center justify-start gap-2">
            {rowActions(row)}
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 120,
      },
    ];
  }, [actionsHeader, rowActions]);

  const allColumns = React.useMemo<ColumnDef<TData, unknown>[]>(
    () => [...selectionColumn, ...columns, ...actionsColumn],
    [selectionColumn, columns, actionsColumn],
  );

  const fallbackGlobalFilter = React.useCallback<FilterFn<TData>>(
    (row, _columnId, value) => {
      const haystack = JSON.stringify(row.original).toLowerCase();
      return haystack.includes(String(value ?? "").toLowerCase());
    },
    [],
  );

  const table = useReactTable<TData>({
    data,
    columns: allColumns,
    state: {
      sorting,
      globalFilter: manualPagination ? "" : globalFilter,
      rowSelection,
      ...(controlledPagination ? { pagination: controlledPagination } : {}),
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: globalFilterFn ?? fallbackGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: manualPagination ? undefined : getFilteredRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    manualPagination,
    pageCount: manualPagination ? pageCount : undefined,
    initialState: controlledPagination
      ? undefined
      : {
          pagination: { pageSize: initialPageSize },
        },
  });

  React.useEffect(() => {
    if (!onSelectionChange) return;
    const selected = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    onSelectionChange(selected);
  }, [onSelectionChange, rowSelection, table]);

  const paginationState = table.getState().pagination;
  const currentPage = paginationState?.pageIndex ?? 0;
  const currentPageSize = paginationState?.pageSize ?? initialPageSize;
  const computedPageCount =
    totalRows && currentPageSize > 0
      ? Math.ceil(totalRows / currentPageSize)
      : 0;
  const totalPagesCount = manualPagination
    ? pageCount ?? computedPageCount
    : table.getPageCount();
  const totalRowsCount = manualPagination
    ? totalRows ?? 0
    : table.getFilteredRowModel().rows.length;
  const hasRows = totalRowsCount > 0;
  const startRow = hasRows ? currentPage * currentPageSize + 1 : 0;
  const endRow = hasRows
    ? Math.min((currentPage + 1) * currentPageSize, totalRowsCount)
    : 0;

  const handlePageSizeChange = (newSize: number) => {
    if (manualPagination && onPaginationChange) {
      onPaginationChange({ pageIndex: 0, pageSize: newSize });
    } else {
      table.setPageSize(newSize);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (manualPagination && onPaginationChange) {
      onPaginationChange({ pageIndex, pageSize: currentPageSize });
    } else {
      table.setPageIndex(pageIndex);
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {searchable && !manualPagination ? (
          <div className="w-full sm:w-80">
            <Input
              placeholder="Buscar..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
            />
          </div>
        ) : (
          <div />
        )}

        {/* Controles rapidos */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filas</span>
            <select
              className="h-9 rounded-md border bg-background px-2 text-sm"
              value={currentPageSize}
              onChange={(event) => handlePageSizeChange(Number(event.target.value))}
            >
              {[5, 10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.resetSorting()}
            >
              Restablecer orden
            </Button>
            {!manualPagination && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setGlobalFilter("");
                  table.resetColumnFilters();
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-xl border bg-card shadow-sm">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const metaSize = (header.column.columnDef as ColumnDefWithSize<TData>)
                    .size;

                  return (
                    <TableHead
                      key={header.id}
                      style={metaSize ? { width: metaSize } : undefined}
                      className="text-[color:var(--muted-foreground)]"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center gap-1 uppercase text-[0.7rem] font-semibold tracking-wide text-current opacity-80 sm:text-xs",
                            canSort && "cursor-pointer select-none",
                          )}
                          onClick={
                            canSort
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                          title={
                            canSort
                              ? "Clic para ordenar. Shift + clic para multi-orden."
                              : undefined
                          }
                        >
                          {transformHeader(
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            ),
                          )}
                          {canSort && (
                            <SortIndicator dir={header.column.getIsSorted()} />
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={allColumns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginacion */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {hasRows ? (
            <>
              {startRow} a {endRow} de {totalRowsCount} fila(s)
              {totalPagesCount > 1 &&
                ` - Página ${currentPage + 1} de ${Math.max(totalPagesCount, 1)}`}
            </>
          ) : (
            "Sin datos"
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(0)}
            disabled={currentPage === 0}
          >
            {"<< Primera"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            {"< Anterior"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= Math.max(totalPagesCount - 1, 0)}
          >
            {"Siguiente >"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(Math.max(totalPagesCount - 1, 0))}
            disabled={currentPage >= Math.max(totalPagesCount - 1, 0)}
          >
            {"Ultima >>"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function transformHeader(node: React.ReactNode): React.ReactNode {
  return typeof node === "string" ? node.toUpperCase() : node;
}

function SortIndicator({ dir }: { dir: SortDirection }) {
  if (!dir) {
    return <span className="text-muted-foreground/70 text-xs">-</span>;
  }

  if (dir === "asc") {
    return <span className="text-muted-foreground text-xs">^</span>;
  }

  if (dir === "desc") {
    return <span className="text-muted-foreground text-xs">v</span>;
  }

  return null;
}
