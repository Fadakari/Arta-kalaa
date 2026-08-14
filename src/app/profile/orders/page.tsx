import { getUserOrders } from "@/services/homeActions";
import { formatToPersianTimeAgo } from "@/utils/formatToPersianTimeAgo";
import { MdShoppingCartCheckout } from "react-icons/md";
import Orders from "./Orders";
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await getUserOrders();

  const shopOrders = Array.isArray(data.shop_orders) ? data.shop_orders : [];
  const discountedOrders = Array.isArray(data.discounted_orders)
    ? data.discounted_orders
    : [];
  const mapOrders = (data: any[], type: "regular" | "discounted") =>
    data.map((order) => ({
      id: `${order?.id || "0"}-${type}`,
      order_id: order?.id,
      order_number: order?.order_number || "-",
      amount: order?.total_amount || order?.discounted_amount || 0,
      amountFormatted:
        (order?.total_amount || order?.discounted_amount)?.toLocaleString(
          "fa-IR"
        ) || "۰",
      status: order?.status || "نامشخص",
      date: order?.order_date || new Date().toISOString(),
      dateFormatted: order?.order_date
        ? formatToPersianTimeAgo(order.order_date)
        : "نامشخص",
      detailsLink:
        type === "discounted"
          ? `/profile/dis-orders/${order?.order_number || "0"}`
          : `/profile/orders/${order?.order_number || "0"}`,
    }));

  const items = [
    ...mapOrders(shopOrders, "regular"),
    ...mapOrders(discountedOrders, "discounted"),
  ];

  return (
    <div>
      <h1 className="flex items-center gap-1 font-semibold text-xl mb-5">
        <MdShoppingCartCheckout className="size-8 text-primary" />
        <span className="pt-1">سفارشات</span>
      </h1>
      <Orders items={items} />
    </div>
  );
}
