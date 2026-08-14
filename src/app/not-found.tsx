import NotFound from "@/components/NotFound";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "صفحه مورد نظر یافت نشد | تکنو صاف",
  description: "متأسفانه صفحه‌ای که به دنبال آن هستید یافت نشد.",
};
function notFound() {
  return <NotFound />;
}

export default notFound;
