import { NextRequest, NextResponse } from "next/server";
import { buildApiUrl } from "@/lib/urls";

const SEARCH_TIMEOUT = 10000;

function extractArticles(data: unknown): unknown[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const obj = data as Record<string, unknown>;
  if (Array.isArray(obj.data)) return obj.data;
  if (Array.isArray(obj.results)) return obj.results;
  if (Array.isArray(obj.posts)) return obj.posts;
  return [];
}

function extractProducts(data: unknown): unknown[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const obj = data as Record<string, unknown>;
  if (Array.isArray(obj.results)) return obj.results;
  if (Array.isArray(obj.data)) return obj.data;
  if (Array.isArray(obj.products)) return obj.products;
  return [];
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SEARCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";

  if (query.length < 3) {
    return NextResponse.json({ articles: [], products: [] });
  }

  const encodedQuery = encodeURIComponent(query);
  const [articlesData, productsData] = await Promise.all([
    fetchWithTimeout(
      buildApiUrl(`/blog/posts/search/?q=${encodedQuery}&page=1`)
    ),
    fetchWithTimeout(buildApiUrl(`/shop/products?search=${encodedQuery}&page=1`)),
  ]);

  return NextResponse.json({
    articles: extractArticles(articlesData),
    products: extractProducts(productsData),
  });
}
