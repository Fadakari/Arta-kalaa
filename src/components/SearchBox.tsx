"use client";

import { useCategories } from "@/context/CategoriesContext";
import { BlogCategoryNode, CategoryNode } from "@/types/categories";
import ProductType from "@/types/product";
import Link from "next/link";
import { useEffect, useState, forwardRef, useRef } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { FaArrowRightLong, FaRegFileLines } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import Image from "next/image";
import { CiImageOff } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { fixImageUrl } from "@/lib/urls";
import { useDebounce } from "use-debounce";

const initialData: {
  articles: BlogCategoryNode[];
  products: ProductType[];
  categories: CategoryNode[];
} = { articles: [], products: [], categories: [] };

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function calculateRelevanceScore(text: string, searchTerm: string): number {
  if (!text || !searchTerm) return 0;
  const textLower = text.toLowerCase();
  const termLower = searchTerm.toLowerCase();
  const words = termLower.split(" ");
  let score = 0;
  if (textLower === termLower) score += 100;
  else if (textLower.startsWith(termLower)) score += 80;
  else if (textLower.includes(termLower)) score += 60;
  words.forEach((word) => {
    if (word.length > 1 && textLower.includes(word)) score += 10;
  });
  return score;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatch(text: string, query: string) {
  if (!query || !text) return text;
  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-blue-100 text-blue-800 rounded px-1">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function SearchInput({
  value,
  onChange,
  loading,
  error,
  data,
  searchValue,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  error: string | null;
  data: {
    articles: BlogCategoryNode[];
    products: ProductType[];
    categories: CategoryNode[];
  };
  searchValue: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleResultClick = () => {
    onChange("");
    setIsModalOpen(false);
  };

  return (
    <div className="z-10 flex items-center p-2">
      <RiSearch2Line className="size-6 absolute right-5 text-blue-400" />
      <input
        ref={inputRef}
        type="search"
        placeholder="جستجو در آرتا کالا.."
        autoComplete="off"
        name="search"
        id="search"
        className="hidden sm:block !bg-white !rounded-full !border-0 !pr-10 w-full text-sm lg:text-base shadow-[0_0_15px_rgba(59,130,246,0.1)] focus:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 outline-none ring-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        onClick={() => setIsModalOpen(true)}
        className="block sm:hidden input !bg-white !rounded-full !border-0 !pr-10 w-full text-sm lg:text-base text-right shadow-[0_0_15px_rgba(59,130,246,0.1)]"
      >
        جستجو در آرتا کالا..
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white flex flex-col">
            <div className="relative">
              <input
                type="search"
                placeholder="جستجو در آرتا کالا.."
                autoComplete="off"
                className="input !bg-white !rounded-none !border-0 !pr-12 placeholder:pr-2 w-full text-xl lg:text-base shadow-[0_0_15px_rgba(59,130,246,0.1)] outline-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-zinc-500"
              >
                <FaArrowRightLong className="size-8" />
              </button>
            </div>
            {searchValue.length > 2 && (
              <SearchResults
                handleResultClick={handleResultClick}
                searchValue={searchValue}
                loading={loading}
                error={error}
                data={data}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductItem({
  product,
  searchValue,
  handleResultClick,
}: {
  product: ProductType;
  searchValue: string;
  handleResultClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = fixImageUrl(product.cover_image);
  return (
    <li className="hover:text-black text-zinc-600 cursor-pointer">
      <Link
        onClick={handleResultClick}
        href={`/product/${product.slug}`}
        className="p-3 hover:bg-blue-50 w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2 flex-1">
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={product.name}
              width={40}
              height={40}
              className="size-10 rounded-md object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="size-10 bg-zinc-200 rounded-md flex items-center justify-center shrink-0">
              <CiImageOff className="size-6 text-zinc-500" />
            </div>
          )}
          <span className="line-clamp-2 text-sm">
            {highlightMatch(product.name, searchValue)}
          </span>
        </div>
        <p className="text-blue-500 text-sm mr-2 shrink-0">
          {product.is_available ? (
            product.isDiscounted ? (
              <div className="flex flex-col items-end">
                <span>
                  {(product?.final_price ?? product.price ?? 0).toLocaleString(
                    "fa-IR"
                  )}{" "}
                  تومان
                </span>
                <span className="line-through text-zinc-400 text-xs">
                  {product.price.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            ) : (
              <span>
                {(product.final_price ?? product.price ?? 0).toLocaleString(
                  "fa-IR"
                )}{" "}
                تومان
              </span>
            )
          ) : (
            "ناموجود"
          )}
        </p>
      </Link>
    </li>
  );
}

function SearchResults({
  loading,
  error,
  data,
  searchValue,
  handleResultClick,
}: {
  loading: boolean;
  error: string | null;
  searchValue: string;
  data: {
    articles: BlogCategoryNode[];
    products: ProductType[];
    categories: CategoryNode[];
  };
  handleResultClick: () => void;
}) {
  const hasResults = !!(
    data.articles?.length ||
    data.products?.length ||
    data.categories?.length
  );

  return (
    <motion.div
      key="search-results"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 mt-2 w-full bg-white sm:border border-blue-100 sm:rounded-xl sm:shadow-lg z-[100] text-lg sm:text-sm font-semibold overflow-auto max-h-[80vh]"
    >
      {loading ? (
        <div className="p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-blue-100 rounded" />
              <div className="flex-1 h-4 bg-blue-100 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-5 text-red-500">{error}</div>
      ) : hasResults ? (
        <>
          {data.categories?.length > 0 && (
            <>
              <div className="p-3 bg-blue-50/50 text-xs text-blue-600 font-bold">
                دسته‌بندی‌ها
              </div>
              <ul className="space-y-2 grid grid-cols-1">
                {data.categories.map((cat) => (
                  <li
                    key={cat.id}
                    className="hover:text-black text-zinc-600 cursor-pointer"
                  >
                    <Link
                      onClick={handleResultClick}
                      href={`/products?category_id=${cat.id}`}
                      className="size-full flex items-center justify-between hover:bg-blue-50 p-3"
                    >
                      <p className="flex items-center gap-1">
                        همه‌ی کالاهای دسته{" "}
                        <span className="text-blue-500">
                          {highlightMatch(cat.name, searchValue)}
                        </span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <hr className="text-blue-100" />
            </>
          )}
          {data.products?.length > 0 && (
            <>
              <div className="p-3 bg-blue-50/50 text-xs text-blue-600 font-bold">
                محصولات
              </div>
              <ul>
                {data.products.slice(0, 6).map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    searchValue={searchValue}
                    handleResultClick={handleResultClick}
                  />
                ))}
              </ul>
              <hr className="text-blue-100" />
            </>
          )}
          {data.articles?.length > 0 && (
            <>
              <div className="p-3 bg-blue-50/50 text-xs text-blue-600 font-bold">
                مقالات
              </div>
              <ul>
                {data.articles.map((article) => (
                  <li
                    key={article.id}
                    className="hover:text-black text-zinc-600 cursor-pointer"
                  >
                    <Link
                      onClick={handleResultClick}
                      href={`/article/${article.slug}`}
                      className="size-full flex items-center justify-between hover:bg-blue-50 p-4"
                    >
                      <p className="flex items-center gap-2">
                        <FaRegFileLines className="size-5" />
                        {highlightMatch(article.title, searchValue)}
                      </p>
                      <FiExternalLink className="size-5 text-blue-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <div className="p-5 text-center text-sm text-zinc-600">
          نتیجه‌ای برای "
          <span className="font-bold text-blue-600">{searchValue}</span>" یافت نشد
        </div>
      )}
    </motion.div>
  );
}

interface SearchBoxProps {
  autoFocus?: boolean;
}

const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
  ({ autoFocus }, ref) => {
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch] = useDebounce(searchValue, 600);
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const categories = useCategories();
    const isMobile = useIsMobile();
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
      if (autoFocus && inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }, [autoFocus, inputRef]);

    const handleResultClick = () => {
      setSearchValue("");
      setData(initialData);
    };

    useEffect(() => {
      abortRef.current?.abort();

      if (debouncedSearch.length <= 2) {
        setData(initialData);
        setLoading(false);
        setError(null);
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;
      const searchTerm = debouncedSearch.trim();

      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch(
            `/api/search?q=${encodeURIComponent(searchTerm)}`,
            { signal: controller.signal, cache: "no-store" }
          );

          if (!response.ok) {
            throw new Error("search_failed");
          }

          const payload = await response.json();
          const articlesArray: BlogCategoryNode[] = Array.isArray(
            payload.articles
          )
            ? payload.articles
            : [];
          const productsArray: ProductType[] = Array.isArray(payload.products)
            ? payload.products
            : [];

          const filteredCategories =
            categories?.reduce((acc: CategoryNode[], cat) => {
              if (!cat) return acc;
              const nameMatch = cat.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());
              if (nameMatch) {
                acc.push(cat);
              } else if (cat.children?.length) {
                const matchedChildren = cat.children.filter(
                  (child: CategoryNode) =>
                    child?.name
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                );
                if (matchedChildren.length) {
                  acc.push({ ...cat, children: matchedChildren });
                }
              }
              return acc;
            }, []) || [];

          const filteredProducts = productsArray
            .filter((product: ProductType) => product?.name)
            .map((product: ProductType) => ({
              ...product,
              relevanceScore: calculateRelevanceScore(product.name, searchTerm),
            }))
            .sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)
            .slice(0, 6);

          const filteredArticles = articlesArray
            .filter((article: BlogCategoryNode) =>
              article?.title
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((article: BlogCategoryNode) => ({
              ...article,
              relevanceScore: calculateRelevanceScore(article.title, searchTerm),
            }))
            .sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)
            .slice(0, 4);

          if (!controller.signal.aborted) {
            setData({
              articles: filteredArticles,
              products: filteredProducts,
              categories: filteredCategories,
            });
          }
        } catch (err) {
          if (controller.signal.aborted) return;
          setError("مشکلی در دریافت نتایج پیش آمد");
          setData(initialData);
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      };

      fetchData();

      return () => controller.abort();
    }, [debouncedSearch, categories]);

    return (
      <div className="relative w-3/4 lg:w-auto lg:min-w-96 xl:min-w-[400px]">
        <SearchInput
          inputRef={inputRef}
          value={searchValue}
          onChange={setSearchValue}
          loading={loading}
          error={error}
          data={data}
          searchValue={debouncedSearch}
        />
        <AnimatePresence>
          {debouncedSearch.length > 2 && !isMobile && (
            <SearchResults
              handleResultClick={handleResultClick}
              searchValue={debouncedSearch}
              loading={loading}
              error={error}
              data={data}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }
);

SearchBox.displayName = "SearchBox";

export default SearchBox;
