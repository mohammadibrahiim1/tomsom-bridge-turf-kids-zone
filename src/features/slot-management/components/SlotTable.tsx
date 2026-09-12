
import React, { useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type Cell,
  type ColumnDef,
  type HeaderGroup,
  type RowSelectionState,
} from '@tanstack/react-table';

import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Layers,
  Search,
  Trash2,
} from 'lucide-react';

import { Slot } from '../slotTypes/slot.types';
import { useDeleteSlotsMutation } from '../service/slotApi/slotApi';
import toast from 'react-hot-toast';

// ============================================================
// Types
// ============================================================

interface SlotTableMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface SlotTableProps {
  data: Slot[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  meta?: SlotTableMeta;
  onPageChange?: (page: number) => void;
}

// ============================================================
// Component
// ============================================================

export const SlotTable: React.FC<SlotTableProps> = ({
  data,
  isLoading,
  isError,
  errorMessage,
  meta,
  onPageChange,
}) => {
  // ==========================================================
  // State
  // ==========================================================

  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>({});


    const [deleteSlots, { isLoading: isDeleting }] = useDeleteSlotsMutation();

  // ==========================================================
  // Safe Data
  // ==========================================================

  const safeData = useMemo<Slot[]>(
    () => (Array.isArray(data) ? data : []),
    [data]
  );



const handleDeleteSelected = async () => {
  const selectedIndexes = Object.keys(rowSelection);
  if (selectedIndexes.length === 0) return;

  const selectedIds = selectedIndexes
    .map((index) => safeData[Number(index)]?.id)
    .filter(Boolean);

  if (selectedIds.length === 0) return;

  const confirmDelete = window.confirm(
    `আপনি কি নিশ্চিতভাবে ${selectedIds.length} টি স্লট মুছে ফেলতে চান?`
  );

  if (!confirmDelete) return;

  try {
    const response = await deleteSlots(selectedIds).unwrap();
    if (response?.success) {
      setRowSelection({}); 
      toast.success(response.message || 'স্লট সফলভাবে মুছে ফেলা হয়েছে!'); // সাকসেস টোস্ট
    }
  } catch (error: any) {
    console.error('Failed to delete slots:', error);
    toast.error(error?.data?.message || 'স্লট ডিলিট করতে সমস্যা হয়েছে।'); // এরর টোস্ট
  }
};


  // ==========================================================
  // Status Badge
  // ==========================================================

  const getStatusBadge = (status?: string): string => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';

      case 'BOOKED':
        return 'bg-rose-100 text-rose-800 border-rose-200';

      case 'MAINTENANCE':
        return 'bg-amber-100 text-amber-800 border-amber-200';

      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // ==========================================================
  // Table Columns
  // ==========================================================

  const columns = useMemo<ColumnDef<Slot>[]>(
    () => [
      // --------------------------------------------------------
      // Selection
      // --------------------------------------------------------

      {
        id: 'select',

        header: ({ table }) => (
          <input
            type="checkbox"
            aria-label="সব স্লট নির্বাচন করুন"
            className="
              w-4
              h-4
              text-indigo-600
              rounded
              border-slate-300
              focus:ring-indigo-500
              cursor-pointer
            "
            checked={table.getIsAllPageRowsSelected()}
            ref={(element) => {
              if (element) {
                element.indeterminate =
                  table.getIsSomePageRowsSelected();
              }
            }}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),

        cell: ({ row }) => (
          <input
            type="checkbox"
            aria-label={`${row?.original?.slotId} নির্বাচন করুন`}
            className="
              w-4
              h-4
              text-indigo-600
              rounded
              border-slate-300
              focus:ring-indigo-500
              cursor-pointer
            "
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),

        enableSorting: false,
        enableColumnFilter: false,
      },

      // --------------------------------------------------------
      // Slot ID / Sport
      // --------------------------------------------------------
      

      {
        accessorKey: 'slotId',

        header: 'স্লট আইডি / খেলা',

        cell: ({ row }) => {
          const slot: Slot = row.original;

          return (
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block">
                {slot?.slotId || '—'}
              </span>

              <span className="text-[11px] text-indigo-600 font-semibold">
                {slot?.sportType || '—'}
                {' • '}
                {slot?.groundTypeBn || slot?.groundType || '—'}
              </span>
            </div>
          );
        },
      },

      // --------------------------------------------------------
      // Package
      // --------------------------------------------------------

      {
        accessorKey: 'packageName',

        header: 'প্যাকেজ',

        cell: ({ row }) => {
          const slot: Slot = row.original;

          return (
            <span className="font-semibold text-slate-700">
              {slot?.packageName || 'সাধারণ প্যাকেজ'}
            </span>
          );
        },
      },

      // --------------------------------------------------------
      // Time
      // --------------------------------------------------------

      {
        accessorKey: 'displayTime',

        header: 'সময়সূচি',

        cell: ({ row }) => {
          const slot: Slot = row.original;

          return (
            <div className="flex items-center gap-1.5 text-slate-700 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-slate-400" />

              <span>
                {slot?.displayTime || '—'}
              </span>
            </div>
          );
        },
      },

      // --------------------------------------------------------
      // Price
      // --------------------------------------------------------

      {
        accessorKey: 'totalPrice',

        header: 'মূল্য',

        cell: ({ row }) => {
          const slot: Slot = row.original;

          return (
            <span className="font-black text-slate-900">
              ৳{slot?.totalPrice ?? 0}
            </span>
          );
        },
      },

      // --------------------------------------------------------
      // Status
      // --------------------------------------------------------

      {
        accessorKey: 'status',

        header: 'স্ট্যাটাস',

        cell: ({ row }) => {
          const status = row.original.status;

          return (
            <span
              className={`
                inline-flex
                items-center
                px-2.5
                py-0.5
                rounded-full
                text-[10px]
                font-extrabold
                border
                ${getStatusBadge(status)}
              `}
            >
              {status === 'AVAILABLE' && (
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
              )}

              {status === 'BOOKED' && (
                <AlertCircle className="w-3 h-3 mr-1 text-rose-600" />
              )}

              {status === 'MAINTENANCE' && (
                <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
              )}

              {status || 'UNKNOWN'}
            </span>
          );
        },
      },

      // --------------------------------------------------------
      // Actions
      // --------------------------------------------------------

      {
        id: 'actions',

        header: () => (
          <div className="text-right">
            অ্যাকশন
          </div>
        ),

        cell: () => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              title="সম্পাদনা করুন"
              aria-label="সম্পাদনা করুন"
              className="
                p-1.5
                text-slate-500
                hover:text-indigo-600
                hover:bg-indigo-50
                rounded-lg
                transition-colors
                cursor-pointer
              "
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {/* <button
              type="button"
              title="মুছে ফেলুন"
              aria-label="মুছে ফেলুন"
              className="
                p-1.5
                text-slate-500
                hover:text-rose-600
                hover:bg-rose-50
                rounded-lg
                transition-colors
                cursor-pointer
              "
            >
              <Trash2 className="w-4 h-4" />
            </button> */}
          </div>
        ),
      },
    ],
    []
  );

  // ==========================================================
  // TanStack Table
  // ==========================================================

  const table = useReactTable<Slot>({
    data: safeData,

    columns,

    state: {
      globalFilter,
      rowSelection,
    },

    // --------------------------------------------------------
    // Row Selection
    // --------------------------------------------------------

    enableRowSelection: true,

    onRowSelectionChange: setRowSelection,

    // --------------------------------------------------------
    // Global Search
    // --------------------------------------------------------

    onGlobalFilterChange: setGlobalFilter,

    globalFilterFn: 'includesString',

    // --------------------------------------------------------
    // Row Models
    // --------------------------------------------------------

    getCoreRowModel: getCoreRowModel(),

    getFilteredRowModel: getFilteredRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
  });

  // ==========================================================
  // Loading State
  // ==========================================================

  if (isLoading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div
          className="
            w-8
            h-8
            border-4
            border-indigo-600
            border-t-transparent
            rounded-full
            animate-spin
          "
        />

        <p className="text-sm font-bold text-slate-600">
          স্লটের ডেটা লোড হচ্ছে...
        </p>
      </div>
    );
  }

  // ==========================================================
  // Error State
  // ==========================================================

  if (isError) {
    return (
      <div className="p-12 text-center bg-rose-50 border border-rose-100 rounded-lg">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />

        <h4 className="text-base font-bold text-rose-800">
          ডেটা লোড করতে সমস্যা হয়েছে!
        </h4>

        <p className="text-xs text-rose-600 mt-1">
          {errorMessage ||
            'সার্ভার থেকে রেসপন্স পেতে ব্যর্থ হয়েছে।'}
        </p>
      </div>
    );
  }

  // ==========================================================
  // Table Data
  // ==========================================================

  const rows = table.getRowModel().rows;

  const selectedRowsCount =
    Object.keys(rowSelection).length;

  // ==========================================================
  // Pagination
  // ==========================================================

  const isServerPagination =
    Boolean(meta && onPageChange);

  const currentPage = isServerPagination
    ? Math.max((meta?.page ?? 1) - 1, 0)
    : table.getState().pagination?.pageIndex ?? 0;

  const totalPages = isServerPagination
    ? Math.max(meta?.totalPage ?? 1, 1)
    : Math.max(table.getPageCount(), 1);

  const totalItems = isServerPagination
    ? meta?.total ?? 0
    : safeData.length;

  const canPreviousPage = isServerPagination
    ? (meta?.page ?? 1) > 1
    : table.getCanPreviousPage();

  const canNextPage = isServerPagination
    ? (meta?.page ?? 1) < (meta?.totalPage ?? 1)
    : table.getCanNextPage();

  // ==========================================================
  // Pagination Handlers
  // ==========================================================

  const handlePreviousPage = () => {
    if (isServerPagination) {
      const previousPage = Math.max(
        (meta?.page ?? 1) - 1,
        1
      );

      onPageChange?.(previousPage);

      return;
    }

    table.previousPage();
  };

  const handleNextPage = () => {
    if (isServerPagination) {
      const nextPage = Math.min(
        (meta?.page ?? 1) + 1,
        meta?.totalPage ?? 1
      );

      onPageChange?.(nextPage);

      return;
    }

    table.nextPage();
  };

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <div className="bg-white border border-slate-200/80 rounded-md shadow-sm overflow-hidden">

      {/* ======================================================
          Header
      ======================================================= */}

      <div
        className="
          p-4
          sm:p-5
          border-b
          border-slate-100
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
        "
      >
        <div>
          <h3 className="text-base font-bold text-slate-900">
            তৈরিকৃত স্লটের তালিকা
          </h3>

          <p className="text-xs text-slate-500 font-medium">
            {selectedRowsCount > 0
              ? `${selectedRowsCount} টি স্লট সিলেক্ট করা হয়েছে`
              : 'সকল সক্রিয় টার্ফ স্লটের সিডিউল ও ম্যানেজমেন্ট'}
          </p>
        </div>

        {/* ====================================================
            Search
        ===================================================== */}

        <div className='flex items-center gap-3 w-full sm:w-auto' >


{selectedRowsCount > 0 && (
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'মুছে ফেলা হচ্ছে...' : `মুছে ফেলুন (${selectedRowsCount})`}
            </button>
          )}

          <div className="relative w-full sm:w-72">
          <Search
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              w-4
              h-4
              text-slate-400
            "
          />

          <input
            type="text"
            value={globalFilter}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
              if (!isServerPagination) {
                table.setPageIndex(0);
              }
            }}
            placeholder="স্লট খুঁজুন (আইডি, স্পোর্টস, সময়)..."
            className="
              w-full
              pl-9
              pr-4
              py-2
              bg-slate-50
              border
              border-slate-200
              rounded-lg
              text-xs
              font-semibold
              text-slate-800
              focus:outline-none
              focus:border-indigo-500
              focus:bg-white
              transition-all
            "
          />
        </div>
        </div>
      </div>

      {/* ======================================================
          Table
      ======================================================= */}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">

          {/* ==================================================
              Table Head
          =================================================== */}

          <thead>
            {table
              .getHeaderGroups()
              .map(
                (headerGroup: HeaderGroup<Slot>) => (
                  <tr
                    key={headerGroup.id}
                    className="
                      bg-slate-50/80
                      border-b
                      border-slate-100
                      text-[11px]
                      uppercase
                      font-extrabold
                      text-slate-500
                      tracking-wider
                    "
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="
                          p-4
                          first:pl-6
                          last:pr-6
                        "
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                )
              )}
          </thead>

          {/* ==================================================
              Table Body
          =================================================== */}

          <tbody
            className="
              divide-y
              divide-slate-100
              text-xs
              font-semibold
            "
          >
            {rows?.length > 0 ? (
              rows?.map((row) => (
                <tr
                  key={row.id}
                  className={`
                    transition-colors
                    ${
                      row.getIsSelected()
                        ? 'bg-indigo-50/50'
                        : 'hover:bg-slate-50/60'
                    }
                  `}
                >
                  {row
                    .getVisibleCells()
                    .map(
                      (cell: Cell<Slot, unknown>) => (
                        <td
                          key={cell.id}
                          className="
                            p-4
                            first:pl-6
                            last:pr-6
                            whitespace-nowrap
                          "
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="
                    text-center
                    py-12
                    text-slate-400
                  "
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Layers className="w-8 h-8 text-slate-300" />

                    <span>
                      কোনো স্লট পাওয়া যায়নি!
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ======================================================
          Pagination Footer
      ======================================================= */}

      <div
        className="
          p-4
          bg-slate-50/50
          border-t
          border-slate-100
          flex
          flex-col
          sm:flex-row
          items-center
          justify-between
          gap-3
          text-xs
        "
      >
        {/* ----------------------------------------------------
            Pagination Info
        ----------------------------------------------------- */}

        <div className="text-slate-500 font-medium">
          পৃষ্ঠা{' '}

          <span className="font-bold text-slate-700">
            {currentPage + 1}
          </span>{' '}

          এর মধ্যে{' '}

          <span className="font-bold text-slate-700">
            {totalPages}
          </span>{' '}

          (মোট{' '}

          <span className="font-bold text-slate-700">
            {totalItems}
          </span>{' '}

          টি স্লট)
        </div>

        {/* ----------------------------------------------------
            Pagination Buttons
        ----------------------------------------------------- */}

        <div className="flex items-center gap-2">

          {/* Previous */}

          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={!canPreviousPage}
            className="
              flex
              items-center
              gap-1
              px-3
              py-1.5
              bg-white
              border
              border-slate-200
              rounded-lg
              font-bold
              text-slate-700
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:bg-slate-100
              transition-all
              cursor-pointer
            "
          >
            <ChevronLeft className="w-4 h-4" />

            পূর্ববর্তী
          </button>

          {/* Next */}

          <button
            type="button"
            onClick={handleNextPage}
            disabled={!canNextPage}
            className="
              flex
              items-center
              gap-1
              px-3
              py-1.5
              bg-white
              border
              border-slate-200
              rounded-lg
              font-bold
              text-slate-700
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:bg-slate-100
              transition-all
              cursor-pointer
            "
          >
            পরবর্তী

            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
};

