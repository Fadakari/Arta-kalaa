"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { BiSearch } from "react-icons/bi";
import { MdChevronLeft } from "react-icons/md";
import { useEffect, useRef, useState, useTransition } from "react";
import { GoChevronUp } from "react-icons/go";
import { NumberInput, Slider, SliderValue } from "@heroui/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCategories } from "@/context/CategoriesContext";
import { useStartNavigation } from "@/context/NavigationProvider";

const minPrice = 3000;
const maxPrice = 459420000;

export default function FilterBox({
  isShow,
}: {
  selected?: boolean;
  isShow?: boolean;
}) {
  const categories = useCategories();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const startNavigation = useStartNavigation();

  const [isPending, startTransition] = useTransition();

  const [selectedKeys, setSelectedKeys] = useState<any>(new Set(["1"]));
  const [selectedKeys2, setSelectedKeys2] = useState<any>(new Set(["1"]));
  const [value, setValue] = useState<SliderValue>([
    Number(searchParams?.get("min_price")) || minPrice,
    Number(searchParams?.get("max_price")) || maxPrice,
  ]);
  const [minInput, setMinInput] = useState(minPrice);
  const [maxInput, setMaxInput] = useState(maxPrice);
  const [searchCategory, setSearchCategory] = useState<string>("");

  useEffect(() => {
    if (Array.isArray(value)) {
      setMinInput(value[0]);
      setMaxInput(value[1]);
    }
  }, [value]);

  const reverseValue = (val: SliderValue) => {
    if (Array.isArray(val)) {
      return [maxPrice - (val[1] - minPrice), maxPrice - (val[0] - minPrice)];
    }
    return maxPrice - ((val as number) - minPrice);
  };

  const handleSliderChange = (val: SliderValue) => {
    if (Array.isArray(val)) setValue(reverseValue(val));
  };

  const handleMinChange = (val: number) => {
    setMinInput(val);
    setValue([val, maxInput]);
  };

  const handleMaxChange = (val: number) => {
    setMaxInput(val);
    setValue([minInput, val]);
  };

  const applyFilters = (params: Record<string, any>) => {
    startNavigation();
    startTransition(() => {
      const query = new URLSearchParams(searchParams);
      if (params.category_id !== undefined)
        query.set("category_id", params.category_id.toString());
      if (params.min_price !== undefined)
        query.set("min_price", params.min_price.toString());
      if (params.max_price !== undefined)
        query.set("max_price", params.max_price.toString());
      if (params.is_available !== undefined) {
        if (params.is_available === false) {
          query.delete("is_available");
        } else {
          query.set("is_available", String(params.is_available));
        }
      }
      if (params.is_featured !== undefined)
        query.set("is_featured", String(params.is_featured));
      if (params.search) query.set("search", params.search);
      if (params.new_days !== undefined)
        query.set("new_days", params.new_days.toString());
      if (params.sort) query.set("sort", params.sort);
      if (params.page !== undefined) query.set("page", params.page.toString());

      router.push(`${pathname}?${query.toString()}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const searchedCategories = categories?.filter((i) =>
    i.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const activeFilters = {
    category_id: searchParams.get("category_id"),
    min_price: searchParams.get("min_price"),
    max_price: searchParams.get("max_price"),
    is_available: searchParams.get("is_available"),
  };

  const hasActiveFilter = Object.values(activeFilters).some(Boolean);
  const [isClearing, setIsClearing] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    if (listRef.current) {
      setHasScroll(listRef.current.scrollHeight > listRef.current.clientHeight);
    }
  }, [searchedCategories]);
  return (
    <div
      className={`h-full fixed top-0 left-0 ${isShow ? "space-y-4" : "hidden lg:flex w-1/3"} flex-col gap-2 sticky`}
    >
      {hasActiveFilter && (
        <button
          onClick={() => {
            setIsClearing(true);
            startNavigation();
            startTransition(() => {
              router.push(pathname);
              window.scrollTo({ top: 0, behavior: "smooth" });
              setIsClearing(false);
            });
          }}
          disabled={isPending && isClearing}
          className="text-white bg-danger hover:bg-red-500 transition py-3 font-semibold text-base rounded-xs disabled:opacity-50 w-full"
        >
          {isPending && isClearing ? "در حال حذف..." : "حذف فیلترها"}
        </button>
      )}
      {hasActiveFilter && (
        <div className="bg-white shadow rounded-sm px-4 py-3 text-sm text-zinc-700 space-y-2 border border-zinc-100">
          <p className="font-semibold text-zinc-600">فیلترهای فعال:</p>
          <ul className="space-y-1  leading-6">
            {activeFilters.is_available && (
              <li className="flex items-center gap-1">
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-800 font-medium">
                  فقط کالاهای موجود
                </span>
              </li>
            )}
            {activeFilters.category_id && (
              <li className="flex items-center gap-1">
                <span className="text-zinc-500">• دسته:</span>
                <span className="text-zinc-800 font-medium">
                  {
                    categories.find(
                      (c) => c.id.toString() === activeFilters.category_id
                    )?.name
                  }
                </span>
              </li>
            )}
            {activeFilters.min_price && activeFilters.max_price && (
              <li className="flex items-center gap-1">
                <span className="text-zinc-500">• قیمت:</span>
                <span className="text-zinc-800 font-medium">
                  {Number(activeFilters.min_price).toLocaleString("fa-IR")} تا{" "}
                  {Number(activeFilters.max_price).toLocaleString("fa-IR")}{" "}
                  تومان
                </span>
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="bg-white shadow rounded-sm px-3 py-2 flex gap-3 items-center text-zinc-700">
        <div className="switch-container">
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            checked={searchParams.get("is_available") === "true" || false}
            onChange={(e) => applyFilters({ is_available: e.target.checked })}
          />
          <label className="switch" htmlFor="checkbox">
            <span className="slider"></span>
          </label>
        </div>
        <p className="text-light">نمایش کالا های موجود</p>
      </div>
      <div className="bg-white shadow rounded-sm px-3 py-0 text-zinc-700 relative">
        <GoChevronUp
          className={`size-5 absolute top-5 left-5 transition-transform duration-300 ${
            selectedKeys.size === 1 ? "-rotate-180" : "rotate-0"
          }`}
        />
        <Accordion
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          showDivider={false}
          hideIndicator
        >
          <AccordionItem key="1" title="دسته بندی دقیق تر">
            <div className="relative w-full flex items-center">
              <input
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                autoComplete="off"
                autoFocus
                type="search"
                placeholder="جستجو ..."
                className="p-2 pr-10 border border-zinc-300 rounded-xs w-full outline-none"
              />
              <BiSearch className="size-6 absolute top-3 right-2 text-zinc-400" />
            </div>
            {hasScroll && (
              <div className="absolute bg-gradient-to-t from-black/10 to-transparent w-full h-10 bottom-0 left-0 pointer-events-none"></div>
            )}
            <ul
              className="overflow-y-auto max-h-64 text-zinc-500 pt-4 relative rounded-2xl mb-2 xl:mb-4"
              ref={listRef}
            >
              {Array.isArray(searchedCategories) &&
              searchedCategories.length > 0 ? (
                searchedCategories.map((cat) => {
                  const selectedId = searchParams.get("category_id");
                  const isParentSelected = selectedId === cat.id.toString();
                  const isChildSelected = cat.children?.some(
                    (child) => child.id.toString() === selectedId
                  );

                  return (
                    <li key={cat.id} className="mb-1">
                      <button
                        onClick={() => applyFilters({ category_id: cat.id })}
                        className={`py-2 flex items-center gap-1 ${
                          isParentSelected ? "text-primary-500 font-bold" : ""
                        }`}
                      >
                        <MdChevronLeft className="size-5" />
                        <span>{cat.name}</span>
                      </button>

                      {(isParentSelected || isChildSelected) &&
                        cat.children &&
                        cat.children.length > 0 && (
                          <ul className="pl-6 border-r border-zinc-200 ml-2">
                            {cat.children.map((child) => {
                              const isChildActive =
                                selectedId === child.id.toString();
                              return (
                                <li key={child.id}>
                                  <button
                                    onClick={() =>
                                      applyFilters({ category_id: child.id })
                                    }
                                    className={`py-1 flex items-center gap-1 text-sm ${
                                      isChildActive
                                        ? "text-primary-500 font-bold"
                                        : ""
                                    }`}
                                  >
                                    <MdChevronLeft className="size-4" />
                                    <span>{child.name}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                    </li>
                  );
                })
              ) : (
                <>دسته بندی یافت نشد</>
              )}
            </ul>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="relative bg-white shadow rounded-sm py-0 text-zinc-700">
        <GoChevronUp
          className={`size-5 absolute top-5 left-5 transition-transform duration-300 ${
            selectedKeys2.size === 1 ? "-rotate-180" : "rotate-0"
          }`}
        />
        <Accordion
          selectedKeys={selectedKeys2}
          onSelectionChange={setSelectedKeys2}
          showDivider={false}
          hideIndicator
          className="!px-0"
        >
          <AccordionItem
            key="1"
            title="محدوده قیمت مورد نظر"
            classNames={{ title: "pr-5" }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyFilters({ min_price: minInput, max_price: maxInput });
              }}
              className="flex flex-col w-full"
            >
              <Slider
                className="max-w-md border-none px-6 mb-4"
                maxValue={maxPrice}
                minValue={minPrice}
                renderThumb={(props) => (
                  <div
                    {...props}
                    className="group p-px top-1/2 bg-zinc-400 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                  >
                    <span className="transition-transform bg-white shadow-small rounded-full size-6 block scale-50 group-data-[dragging=true]:scale-70" />
                  </div>
                )}
                classNames={{
                  filler: "bg-zinc-400",
                  track: "bg-zinc-300 h-1 rounded-sm !border-none",
                }}
                hideValue
                value={reverseValue(value)}
                onChange={handleSliderChange}
                dir="rtl"
                aria-label="Volume"
              />

              <div className="flex w-full justify-between items-center border-t border-b border-zinc-200 my-2 px-3">
                <div className="flex flex-col items-center gap-2 text-default-500 font-medium text-small w-full p-5 border-l border-zinc-200">
                  <label htmlFor="min-price-input">از</label>
                  <NumberInput
                    id="min-price-input"
                    aria-label="min-price-input"
                    value={minInput}
                    onValueChange={handleMinChange}
                    hideStepper
                    size="sm"
                    classNames={{
                      inputWrapper: "input !rounded-full",
                      input: "input font-dana  border-none",
                    }}
                    minValue={minPrice}
                    maxValue={maxPrice}
                  />
                  <p>تومان</p>
                </div>
                <div className="h-full w-5 bg-zinc-200" />
                <div className="flex flex-col items-center gap-2 text-default-500 font-medium text-small w-full p-5">
                  <label htmlFor="max-price-input">تا</label>
                  <NumberInput
                    aria-label="max-price-input"
                    id="max-price-input"
                    size="sm"
                    value={maxInput}
                    onValueChange={handleMaxChange}
                    hideStepper
                    classNames={{
                      inputWrapper: "input !rounded-full",
                      input: "input font-dana border-none",
                    }}
                    minValue={minPrice}
                    maxValue={maxPrice}
                  />
                  <p>تومان</p>
                </div>
              </div>
              <button
                className="btn btn-primary mx-auto p-3 font-light rounded-xs disabled:opacity-50"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "در حال اعمال..." : "اعمال محدوده قیمت"}
              </button>
            </form>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
