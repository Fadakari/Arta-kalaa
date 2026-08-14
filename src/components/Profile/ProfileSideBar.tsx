"use client";
import { NavLink } from "@/app/profile/layout";
import { useUser } from "@/context/UserContext";
import { convertNumberToPersian } from "@/utils/converNumbers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";

function ProfileSideBar({ links }: { links: NavLink[] }) {
  const { user } = useUser();
  const pathname = usePathname();
  if (!user) return <>کاربر پیدا نشد</>;

  return (
    <div className="flex flex-col rounded-tl-[60px] md:rounded-tl-xl rounded-tr-[60px] rounded-xl md:w-1/4 h-full overflow-hidden">
      <div className="bg-primary text-zinc-100 py-10 px-7 space-y-2">
        <div className="flex gap-2">
          <div className="size-20 rounded-full bg-zinc-600">
            <FaUserCircle className="size-20 text-white rounded-full" />
          </div>
          <div className="flex flex-col font-medium">
            <p className="font-semibold text-lg">
              {user.identity?.first_name || "بدون نام"} {user.identity?.last_name}
            </p>
            <p>{convertNumberToPersian(user.identity?.phone_number)}</p>
            <button
              onClick={async () => {
                await fetch("/internal-api/auth/logout/", {
                  method: "POST",
                  credentials: "include",
                });
                location.replace("/");
              }}
              className="bg-white px-2 mt-2 py-1 rounded-lg text-red-500 flex items-center gap-0.5 active:scale-90"
            >
              <MdOutlineLogout className="size-5" />
              خروج از حساب
            </button>
          </div>
        </div>
      </div>

      <ul className="bg-white border-l border-r border-b border-zinc-200 rounded-b-xl py-10 px-7 w-full font-semibold space-y-0.5">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li className="w-full" key={link.href}>
              <Link
                href={link.href}
                className={`px-3 py-3.5 flex items-center gap-2 justify-start rounded-2xl w-full transition-all 
                  ${isActive ? "bg-primary-100 text-primary-700" : "text-zinc-700 hover:bg-primary-100 "}
                `}
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ProfileSideBar;
