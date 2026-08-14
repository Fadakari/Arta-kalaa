// src/lib/urls.ts

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.artakalaa.com";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://artakalaa.com";

/** Proxy فقط وقتی لازم است که API روی HTTP باشد (Mixed Content) */
export function shouldUseApiProxy(isBrowser = typeof window !== "undefined"): boolean {
  if (!isBrowser) return false;
  if (process.env.NEXT_PUBLIC_USE_PROXY !== "true") return false;
  return !API_URL.startsWith("https://");
}

export function getApiBaseUrl(isBrowser = typeof window !== "undefined"): string {
  return shouldUseApiProxy(isBrowser) ? "/api" : API_URL;
}

export function fixImageUrl(url: string | undefined | null): string {
  if (!url) return "";

  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }

  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  if (url.startsWith("https://")) {
    return url;
  }

  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${API_URL}${cleanUrl}`;
}

export function buildApiUrl(pathname: string, queryString = ""): string {
  const base = API_URL.replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}${queryString ? `?${queryString}` : ""}`;
}

export function isProductionSite(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    SITE_URL.startsWith("https://")
  );
}