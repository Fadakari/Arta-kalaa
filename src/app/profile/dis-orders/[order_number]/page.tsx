import { notFound } from "next/navigation";
import { GetDiscountedOrder } from "@/services/homeActions";
import Order from "@/components/Order";
export const dynamic = 'force-dynamic';

async function Page({ params }: any) {
  const orderNumber = String((await params).order_number);
  const order = await GetDiscountedOrder(orderNumber);
  if (!order) return notFound();
  return (
    <div>
      <Order order={order} />
    </div>
  );
}

export default Page;
