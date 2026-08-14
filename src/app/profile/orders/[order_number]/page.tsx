import Order from "@/components/Order";
import { GetUserDashboard } from "@/services/authActions";
import { notFound } from "next/navigation";
export const dynamic = 'force-dynamic';
async function Page({ params }: { params: Promise<{ order_number: string }> }) {
  const data = await GetUserDashboard();
  const { order_number } = await params;
  
  // چک کردن وجود data و orders
  if (!data || !data.orders) {
    return notFound();
  }
  
  const foundOrder = data.orders.find(
    (order) => String(order.order_number) === String(order_number)
  );
  
  if (!foundOrder) {
    return notFound();
  }
  
  return (
    <div>
      <Order order={foundOrder} />
    </div>
  );
}

export default Page;