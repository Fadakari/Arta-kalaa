import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  cn,
} from "@heroui/react";
import { FiUser, FiLogOut, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa6";
import { convertNumberToPersian } from "@/utils/converNumbers";

export default function UserDropdown({ user }: { user: any }) {
  const iconClasses = "text-xl text-default-500 pointer-events-none shrink-0";

  const name =
    user?.identity?.first_name && user?.identity?.last_name
      ? `${user.identity.first_name} ${user.identity.last_name}`
      : "بدون نام";
  const firstLetter =
    user?.identity?.first_name?.[0] || user?.identity?.phone_number?.[0] || "؟";
  const phone = user?.identity?.phone_number ?? "بدون شماره";
  const onLogout = async () => {
    await fetch("/internal-api/auth/logout/", {
      method: "POST",
      credentials: "include",
    });
    location.reload();
  };

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <button
          className="text-black hover:!bg-zinc-100 active:!bg-zinc-200 bg-white  flex gap-2  items-center rounded-2xl px-3 py-1.5"
          aria-label="حساب کاربری"
        >
          <FiUser className="size-6 " />
          <FaChevronDown className="size-3" />
        </button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="منوی حساب کاربری"
        variant="faded"
        className="text-right"
      >
        <DropdownSection>
          <DropdownItem
            isReadOnly
            key="user-info"
            isDisabled
            className="flex flex-row  cursor-default opacity-100 "
          >
            <div className="flex flex-row  gap-3">
              <div className="size-11 ring-4 ring-primary-100 flex items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                {firstLetter}
              </div>
              <div>
                <p className="font-semibold text-base">{name}</p>
                <p className="text-sm text-gray-500">
                  {convertNumberToPersian(phone)}
                </p>
              </div>
            </div>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection showDivider>
          <DropdownItem
            key="profile"
            startContent={<FiUser className={iconClasses} />}
            as={Link}
            href="/profile"
          >
            حساب کاربری
          </DropdownItem>
          <DropdownItem
            key="orders"
            startContent={<FiShoppingBag className={iconClasses} />}
            as={Link}
            href="/profile/orders"
          >
            سفارش‌های من
          </DropdownItem>
        </DropdownSection>

        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          startContent={<FiLogOut className={cn(iconClasses, "text-danger")} />}
          onClick={onLogout}
        >
          خروج
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
