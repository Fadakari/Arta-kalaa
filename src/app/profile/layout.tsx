import { ReactNode } from "react";
import { GetUserDashboard } from "@/services/serverAuthActions";
import { redirect } from "next/navigation";
import { CiShoppingCart, CiShoppingBasket, CiUser } from "react-icons/ci";
import ProfileSideBar from "@/components/Profile/ProfileSideBar";
import { headers } from "next/headers";
export type NavLink = {
  name: string;
  href: string;
  icon: ReactNode;
};
const links: NavLink[] = [
  {
    name: "خلاصه فعالیت ها",
    href: "/profile",
    icon: <CiUser className="size-5 stroke-1" />,
  },
  {
    name: "اطلاعات حساب کاربری",
    href: "/profile/personal-info",
    icon: <CiUser className="size-5 stroke-1" />,
  },
  {
    name: "سبد خرید",
    href: "/profile/cart",
    icon: <CiShoppingBasket className="size-5 stroke-1" />,
  },
  {
    name: "سفارش  های من",
    href: "/profile/orders",
    icon: <CiShoppingCart className="size-5 stroke-1" />,
  },
];
async function Layout({ children }: { children: ReactNode }) {
  const user = await GetUserDashboard();
  const headersList = await headers();
  const currentPath = headersList.get("x-pathname") || "/profile";

  if (!user) {
    const redirectUrl = `/?authRequired=1&redirectTo=${encodeURIComponent(currentPath)}`;
    redirect(redirectUrl);
  }
  return (
    <section className="flex flex-col md:flex-row gap-5 h-full p-5 container customSm:max-w-[566px]">
      <ProfileSideBar links={links} />
      <div className="md:w-3/4 bg-white h-full p-5 rounded-2xl shadow border border-zinc-200">
        {children}
      </div>
    </section>
  );
}

export default Layout;
