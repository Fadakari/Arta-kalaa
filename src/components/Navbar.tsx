"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { CategoryNode } from "@/types/categories";
import { useUser } from "../context/UserContext";
import { useAuthModal } from "../context/AuthModalProvider";
import { useCategories } from "../context/CategoriesContext";
import { useCart } from "../context/CartContextProvider";
import SearchBox from "./SearchBox";
import UserDropdown from "./UserMenu";
import { User } from "@/types/user";
import { convertNumberToPersian } from "@/utils/converNumbers";
import CartDrawer from "./CartDrawer";
import logo from "../../public/logo.png";

import { GoChevronLeft, GoChevronRight, GoChevronUp } from "react-icons/go";
import { RiMenu3Fill, RiCloseLine } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";
import { CiLogin } from "react-icons/ci";
import { LogOutIcon, Search } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/products", label: "همه محصولات" },
  { href: "/products/offers", label: "کالاهای دارای تخفیف", badge: "ویژه" },
  { href: "/articles", label: "مقالات" },
  { href: "/about-us", label: "درباره ما" },
  { href: "/contact-info", label: "ارتباط با ما" },
];

// ─── رندر دسته‌بندی برای دسکتاپ (مگامنو) ─────────────────
function DesktopCategories({ categories }: { categories: CategoryNode[] }) {
  const renderCategories = (categories: CategoryNode[]) => {
    return (
      <ul className="relative m-0 p-0">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories?.map((category) => (
            <li
              key={category.id}
              className="group relative hover:bg-gray-50 whitespace-nowrap list-none m-0"
            >
              <Link
                href={`/products/?category_id=${category.id}`}
                className="font-normal flex items-center justify-between px-4 w-full h-full py-3 text-[#3d464d] text-sm no-underline"
              >
                {category.name}
                {category.children && category.children.length > 0 && (
                  <GoChevronLeft className="size-4 fill-[#98aab3]" />
                )}
              </Link>
              {category.children && category.children.length > 0 && (
                <div className="absolute top-0 right-full bg-white text-[#3d464d] rounded-lg shadow-xl border border-gray-100 group-hover:visible group-hover:opacity-100 invisible opacity-0 transition-all duration-200 z-50 p-4 min-w-[500px]">
                  <h4 className="font-bold text-gray-800 pb-2 border-b mb-2 m-0">
                    {category.name}
                  </h4>
                  <ul className="grid grid-cols-2 gap-1 m-0 p-0">
                    {category.children.map((child) => (
                      <li key={child.id} className="list-none m-0">
                        <Link
                          href={`/products/?category_id=${child.id}`}
                          className="hover:text-blue-600 transition-colors block py-2 px-2 text-sm text-gray-600 no-underline"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))
        ) : (
          <div className="p-5 w-full text-center text-gray-400">دسته بندی وجود ندارد</div>
        )}
      </ul>
    );
  };

  return (
    <div className="w-[280px] bg-white rounded-b-xl shadow-xl border border-gray-100 overflow-hidden m-0">
      {renderCategories(categories)}
    </div>
  );
}

// ─── MegaMenu (استایل آبی) ────────────────────────────────────
function MegaMenu({ categories }: { categories: CategoryNode[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative shrink-0 m-0"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5"
      >
        <RiMenu3Fill className="size-5" />
        <span className="hidden xl:inline">دسته‌بندی کالاها</span>
        <GoChevronUp className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 z-[60]"
            >
              <DesktopCategories categories={categories} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Mobile Category Component ───────────────────────────────
function MobileCategory({
  categories,
  setStack,
  stack,
  setCurrent,
  current,
  setTitle,
  onClose,
}: {
  categories: CategoryNode[];
  setStack: React.Dispatch<React.SetStateAction<CategoryNode[][]>>;
  stack: CategoryNode[][];
  setCurrent: React.Dispatch<React.SetStateAction<CategoryNode[] | null>>;
  current: CategoryNode[] | null;
  setTitle: (title: string) => void;
  onClose: () => void;
}) {
  const handleEnter = (category: CategoryNode) => {
    if (category.children?.length) {
      setStack((prev) => [...prev, current ?? categories]);
      setCurrent(category.children);
      setTitle(category.name);
    } else {
      window.location.href = `/products/?category_id=${category.id}`;
      onClose();
    }
  };

  const handleShowRootCategories = () => {
    setCurrent(categories);
    setTitle("دسته‌بندی کالاها");
    setStack([]);
  };

  return (
    <div className="w-full bg-white overflow-hidden flex flex-col">
      <div className="border-b border-zinc-200 text-zinc-600 font-light py-3 px-4 flex justify-between items-center">
        <button
          onClick={handleShowRootCategories}
          className="text-lg active:opacity-50 w-full h-full text-right font-medium"
        >
          دسته‌بندی کالاها
        </button>
        <GoChevronLeft className="text-zinc-400 size-5 font-bold absolute left-3 pointer-events-none" />
      </div>

      <div className="flex-1 overflow-hidden relative min-h-[300px]">
        <AnimatePresence initial={false}>
          {stack.map((cats, index) => (
            <motion.div
              key={`level-${index}`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, type: "tween" }}
              className="absolute inset-0 bg-white overflow-y-auto"
              style={{ zIndex: index }}
            >
              <ul className="flex flex-col m-0 p-0">
                {cats.map((cat: CategoryNode) => (
                  <li
                    key={cat.id}
                    className="flex items-center justify-between border-b border-zinc-100 text-zinc-600 py-3 px-4 active:bg-gray-50 list-none m-0"
                  >
                    {cat.children?.length ? (
                      <button
                        className="text-base text-right w-full h-full font-normal"
                        onClick={() => handleEnter(cat)}
                      >
                        {cat.name}
                      </button>
                    ) : (
                      <Link
                        onClick={onClose}
                        href={`/products/?category_id=${cat.id}`}
                        className="text-base text-right w-full h-full font-normal no-underline"
                      >
                        {cat.name}
                      </Link>
                    )}
                    {cat.children?.length ? (
                      <GoChevronLeft className="text-zinc-400 size-4 font-bold absolute pointer-events-none left-3" />
                    ) : null}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {current && (
            <motion.div
              key={`level-${stack.length}`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, type: "tween" }}
              className="absolute inset-0 bg-white overflow-y-auto"
              style={{ zIndex: stack.length }}
            >
              <ul className="flex flex-col m-0 p-0">
                {current.map((cat: CategoryNode) => (
                  <li
                    key={cat.id}
                    className="flex items-center justify-between border-b border-zinc-100 text-zinc-600 py-3 px-4 active:bg-gray-50 list-none m-0"
                  >
                    {cat.children?.length ? (
                      <button
                        className="text-base text-right w-full h-full font-normal"
                        onClick={() => handleEnter(cat)}
                      >
                        {cat.name}
                      </button>
                    ) : (
                      <Link
                        onClick={onClose}
                        href={`/products/?category_id=${cat.id}`}
                        className="text-base text-right w-full h-full font-normal no-underline"
                      >
                        {cat.name}
                      </Link>
                    )}
                    {cat.children?.length ? (
                      <GoChevronLeft className="text-zinc-400 size-4 font-bold absolute pointer-events-none left-3" />
                    ) : null}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Mobile Drawer ───────────────────────────────
export function MobileDrawer({
  categories,
  links,
  user,
  onAuthOpen,
}: {
  categories: CategoryNode[];
  links: typeof NAV_LINKS;
  user: User | null;
  onAuthOpen: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [stack, setStack] = useState<CategoryNode[][]>([]);
  const [current, setCurrent] = useState<CategoryNode[] | null>(null);
  const [title, setTitle] = useState("منوی اصلی");

  const isRoot = current === null;

  const handleBack = () => {
    const prev = stack[stack.length - 1];
    setStack((prevStack) => prevStack.slice(0, -1));
    setCurrent(prev ?? null);
    if (stack.length === 1) {
      setTitle("منوی اصلی");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStack([]);
      setCurrent(null);
      setTitle("منوی اصلی");
    }, 300);
  };

  const name = user?.identity?.first_name && user?.identity?.last_name
    ? `${user.identity.first_name} ${user.identity.last_name}`
    : "کاربر مهمان";
  const firstLetter = user?.identity?.first_name?.[0] || user?.identity?.phone_number?.[0] || "؟";
  const phone = user?.identity?.phone_number ?? "";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hover:bg-gray-100 active:bg-gray-100 p-2 rounded-lg lg:hidden text-zinc-600 transition-colors"
        aria-label="باز کردن منو"
      >
        <RiMenu3Fill className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[70]"
              onClick={handleClose}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 right-0 bottom-0 z-[80] max-w-[340px] bg-white h-full flex flex-col shadow-2xl"
            >
              {/* هدر دراور */}
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {!isRoot && (
                      <button
                        onClick={handleBack}
                        className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white"
                      >
                        <GoChevronRight className="size-5" />
                      </button>
                    )}
                    <p className="font-bold text-white text-base m-0">
                      {!isRoot ? title : "منوی اصلی"}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white"
                  >
                    <RiCloseLine className="size-5" />
                  </button>
                </div>
              </div>

              {/* بدنه دراور */}
              <div className="flex-1 overflow-y-auto">
                {isRoot ? (
                  <>
                    {/* لینک‌های اصلی */}
                    <div className="border-b border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 px-4 py-2 m-0">منوی اصلی</p>
                      {links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={handleClose}
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
                        >
                          <span className="text-sm text-gray-700">{link.label}</span>
                          {link.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>

                    {/* دسته‌بندی محصولات */}
                    <MobileCategory
                      categories={categories}
                      stack={stack}
                      setStack={setStack}
                      current={current}
                      setCurrent={setCurrent}
                      setTitle={setTitle}
                      onClose={handleClose}
                    />
                  </>
                ) : (
                  <MobileCategory
                    categories={categories}
                    stack={stack}
                    setStack={setStack}
                    current={current}
                    setCurrent={setCurrent}
                    setTitle={setTitle}
                    onClose={handleClose}
                  />
                )}
              </div>

              {/* فوتر دراور */}
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                {user?.identity ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-row gap-3 items-center">
                      <div className="size-10 text-base ring-2 ring-blue-200 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold">
                        {firstLetter}
                      </div>
                      <div>
                        <p className="font-semibold text-sm m-0">{name}</p>
                        <p className="text-xs text-gray-500 m-0">{convertNumberToPersian(phone)}</p>
                      </div>
                    </div>
                    <button
                      className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                      onClick={async () => {
                        await fetch("/internal-api/auth/logout/", { method: "POST", credentials: "include" });
                        location.replace("/");
                      }}
                    >
                      <LogOutIcon className="size-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { handleClose(); onAuthOpen(); }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg py-2.5 text-center font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-md"
                  >
                    <CiLogin className="size-5" />
                    ورود / عضویت
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Navbar ─────────────────────────────────
export default function Navbar() {
  const categories = useCategories();
  const pathname = usePathname();
  const { onOpen: onAuthOpen }: any = useAuthModal();
  const { user } = useUser();
  const { cart } = useCart();
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;

    const stickyOffset = navbar.offsetTop;
    
    const handleScroll = () => {
      const shouldBeSticky = window.scrollY >= stickyOffset;
      setIsSticky(shouldBeSticky);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="relative z-50">
      {/* Header بالایی */}
      <div className="bg-white py-2 sm:py-3 px-3 relative z-50 shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-2">
            {/* منوی موبایل */}
            <MobileDrawer onAuthOpen={onAuthOpen} user={user} links={NAV_LINKS} categories={categories} />
            
            {/* لوگو */}
            <Link href="/" className="flex items-center shrink-0">
              <Image src={logo} alt="آرتا کالا" width={120} height={35} priority className="object-contain sm:w-[140px]" />
            </Link>

            {/* سرچ دسکتاپ */}
            <div className="hidden lg:block flex-1 max-w-xl mx-4 relative z-[100]">
              <div className="shadow-[0_4px_12px_-2px_rgba(34,197,94,0.3)] rounded-full">
                <SearchBox />
              </div>
            </div>

            {/* دکمه سرچ موبایل */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors text-zinc-600"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* سبد خرید و تماس */}
            <div className="flex items-center gap-2">
              <Link href="tel:03536264264" className="hidden sm:flex items-center gap-1 text-zinc-600">
                <FiPhoneCall className="size-5" />
                <span className="text-sm font-medium hidden md:inline">035-36264264</span>
              </Link>
              <Link href="tel:03536264264" className="sm:hidden p-2 rounded-full hover:bg-gray-100">
                <FiPhoneCall className="size-5 text-zinc-600" />
              </Link>
              <CartDrawer cart={cart} />
            </div>
          </div>

          {/* سرچ موبایل */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="lg:hidden mt-3 overflow-hidden relative z-[100]"
              >
                <div className="shadow-[0_4px_12px_-2px_rgba(34,197,94,0.3)] rounded-full">
                  <SearchBox />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* NAVBAR دسکتاپ - با قابلیت sticky */}
      <div
        ref={navbarRef}
        className={clsx(
          "hidden lg:block bg-gradient-to-r from-blue-700 to-blue-600 shadow-lg transition-all duration-300",
          isSticky && "fixed top-0 left-0 right-0 z-40"
        )}
      >
        <div className="container mx-auto w-full px-4">
          <div className="flex items-center justify-between h-[54px]">
            <div className="flex items-center h-full gap-0">
              {/* مگامنو */}
              {categories && categories.length > 0 && (
                <MegaMenu categories={categories} />
              )}
              
              {/* لینک‌ها */}
              <nav className="h-full mr-2">
                <ul className="flex items-center h-full gap-1 m-0 p-0">
                  {NAV_LINKS.map(({ href, label, badge }) => (
                    <li key={href} className="list-none m-0">
                      <Link
                        href={href}
                        className={clsx(
                          "inline-flex items-center px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/20 hover:text-white font-medium text-sm no-underline whitespace-nowrap",
                          pathname === href ? "bg-white/20 shadow-sm font-bold text-white" : "text-white/90"
                        )}
                      >
                        {label}
                        {badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 mr-1.5 shadow-sm">
                            {badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* ورود */}
            <div className="flex items-center">
              {user?.identity ? (
                <UserDropdown user={user} />
              ) : (
                <button
                  onClick={onAuthOpen}
                  className="px-4 py-1.5 font-bold rounded-full bg-white hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 text-blue-700 text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
                >
                  <CiLogin className="size-4 stroke-1" />
                  <span>ورود</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* اسپیس برای جلوگیری از جابجایی محتوا وقتی navbar sticky است */}
      {isSticky && <div className="hidden lg:block" style={{ height: "54px" }} />}

      {/* نوار پایین موبایل (دسته‌بندی سریع) */}
      <div className="lg:hidden bg-gradient-to-r from-blue-700 to-blue-600 py-2 px-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const mobileMenuButton = document.querySelector('[aria-label="باز کردن منو"]') as HTMLElement;
              mobileMenuButton?.click();
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full text-white text-xs font-medium"
          >
            <RiMenu3Fill className="size-4" />
            دسته‌بندی
          </button>
          {NAV_LINKS.slice(0, 4).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                pathname === href ? "bg-white/30 text-white" : "text-white/80 hover:text-white hover:bg-white/20"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}