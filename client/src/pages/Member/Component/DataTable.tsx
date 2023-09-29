/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React, { Fragment, useEffect, useState } from "react";
import {
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { RowData } from '@tanstack/react-table';
import { rankItem } from "@tanstack/match-sorter-utils";

import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  PlusCircleIcon
} from "@heroicons/react/24/solid";
import { Menu, Transition } from "@headlessui/react";


interface IChildProps {
  button?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  data: RowData[];
  //columns: ColumnDef<RowData>[];
  columns: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

type AvatarCellProps = {
  display_name: string;
  username: string;
  imageUrl: string;
};

export function AvatarCell({
  display_name,
  username,
  imageUrl,
}: AvatarCellProps) {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 h-10 w-10">
        <img className="h-10 w-10 rounded-full" src={imageUrl} alt="" />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">{display_name}</div>
        <div className="text-sm text-gray-500">{username}</div>
      </div>
    </div>
  );
}

export default function DataTable({ columns, data, button }: IChildProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });


  useEffect(() => {
    table.setPageSize(Number(20))
  }, [table]);

  return (
    <div>
      {/* Table */}
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="py-2 align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-t-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className="divide-x divide-gray-200 dark:divide-gray-300">
                      {headerGroup.headers.map(header => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          key={header.id}
                          scope="col"
                          className="group px-1 py-1 text-left text-xs font-medium text-black tracking-wider"
                        >
                          <div className="flex items-center justify-between">
                            {/* Add a sort direction indicator */}
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-300 w-32 text-sm">
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <tr key={row.id} className="divide-x divide-gray-200 dark:divide-gray-300">
                        {row.getVisibleCells().map((cell) => {
                          return (
                            // <td key={cell.id} className="px-6 py-1 whitespace-nowrap"></td>
                            <td key={cell.id} className="px-6 py-1 whitespace">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <label className="flex gap-x-2 items-baseline">
      <div>
        <div className="relative rounded-md shadow-sm">
          <input
            {...props}
            value={value}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pr-20 text-gray-900 ring-1 bor ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search..."
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
    </label>
  );
}

