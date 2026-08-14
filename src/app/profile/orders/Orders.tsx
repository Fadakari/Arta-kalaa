"use client";

import React from "react";
export const dynamic = 'force-dynamic';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Chip,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import Link from "next/link";
import { goToGateways } from "@/services/shopActions";

const statusMap: Record<
  string,
  { label: string; color: "warning" | "success" | "danger" | "secondary" }
> = {
  pending: { label: "در انتظار", color: "warning" },
  shipped: { label: "ارسال شده", color: "secondary" },
  cancelled: { label: "لغو شده", color: "danger" },
  delivered: { label: "تحویل داده شد", color: "success" },
  paid: { label: "پرداخت شده", color: "success" },
};

interface OrderItem {
  id: string;
  order_id: string;
  order_number: string;
  amount: number;
  amountFormatted: string;
  status: string;
  date: string;
  dateFormatted: string;
  detailsLink: string;
}

export default function Orders({ items }: { items: OrderItem[] }) {
  const list = useAsyncList<OrderItem>({
    async load() {
      return { items: items || [] };
    },
    async sort({ items, sortDescriptor }) {
      const sortedItems = [...items].sort((a, b) => {
        let first: any = a[sortDescriptor.column as keyof OrderItem];
        let second: any = b[sortDescriptor.column as keyof OrderItem];

        if (sortDescriptor.column === "amount") {
          first = Number(first);
          second = Number(second);
        } else if (sortDescriptor.column === "date") {
          first = new Date(first).getTime();
          second = new Date(second).getTime();
        }

        if (first < second)
          return sortDescriptor.direction === "ascending" ? -1 : 1;
        if (first > second)
          return sortDescriptor.direction === "ascending" ? 1 : -1;
        return 0;
      });

      return { items: sortedItems };
    },
  });

  return (
    <Table
      aria-label="Order list table"
      classNames={{ table: "min-h-[400px]" }}
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      isVirtualized
      isHeaderSticky
    >
      <TableHeader>
        <TableColumn key="order_number" allowsSorting>
          شماره سفارش
        </TableColumn>
        <TableColumn key="amount" allowsSorting>
          مبلغ کل
        </TableColumn>
        <TableColumn key="status" allowsSorting>
          وضعیت
        </TableColumn>
        <TableColumn key="date" allowsSorting>
          تاریخ
        </TableColumn>
        <TableColumn>جزئیات</TableColumn>
      </TableHeader>

      <TableBody
        items={list.items}
        loadingContent={<Spinner variant="simple" label="در حال بارگذاری..." />}
      >
        {(item) => (
          <TableRow key={`${item.id}`}>
            <TableCell>{item.order_number}</TableCell>
            <TableCell>{item.amountFormatted}</TableCell>
            <TableCell>
              <Chip
                color={statusMap[item.status]?.color || "default"}
                variant="flat"
                size="sm"
              >
                {statusMap[item.status]?.label || item.status}
              </Chip>
            </TableCell>
            <TableCell>{item.dateFormatted}</TableCell>
            <TableCell>
              <Link
                href={item.detailsLink}
                className="underline underline-offset-2"
              >
                جزییات سفارش
              </Link>

              {item.status === "pending" && (
                <button
                  onClick={() => goToGateways(item.order_id)}
                  className="mr-2 px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  پرداخت
                </button>
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
