import { HiOutlineUsers, HiOutlineShoppingBag, HiOutlineShieldCheck, HiOutlineClock } from "react-icons/hi";

const stats = [
  {
    icon: HiOutlineShoppingBag,
    value: "+۲۰۰",
    label: "محصول متنوع",
  },
  {
    icon: HiOutlineUsers,
    value: "+۱۰۰۰",
    label: "مشتری راضی",
  },
  {
    icon: HiOutlineShieldCheck,
    value: "۱۰۰٪",
    label: "اصالت کالا",
  },
  {
    icon: HiOutlineClock,
    value: "۲۴/۷",
    label: "پشتیبانی آنلاین",
  },
];

export default function AboutStats() {
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-3 inline-flex rounded-xl bg-primary-100 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <stat.icon className="size-6" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
