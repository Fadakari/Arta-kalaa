"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import SiteLoader from "@/components/SiteLoader";

type NavigationContextValue = {
  startNavigation: () => void;
};

const NavigationContext = createContext<NavigationContextValue>({
  startNavigation: () => {},
});

export function useStartNavigation() {
  return useContext(NavigationContext).startNavigation;
}

function isInternalLink(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  if (anchor.target === "_blank") return false;
  if (href.startsWith("http") && !href.startsWith(window.location.origin)) return false;
  return true;
}

function getCurrentLocation() {
  return `${window.location.pathname}${window.location.search}`;
}

function resolveHref(href: string) {
  const url = new URL(href, window.location.origin);
  return `${url.pathname}${url.search}`;
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const prevLocation = useRef<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const stopNavigation = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsLoading(false);
  }, []);

  const startNavigation = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    const currentLocation = getCurrentLocation();
    if (prevLocation.current !== null && prevLocation.current !== currentLocation) {
      stopNavigation();
    }
    prevLocation.current = currentLocation;
  });

  useEffect(() => {
    stopNavigation();
  }, [pathname, stopNavigation]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || !isInternalLink(anchor)) return;

      const href = anchor.getAttribute("href")!;
      const nextLocation = resolveHref(href);
      const currentLocation = getCurrentLocation();

      if (nextLocation === currentLocation) return;
      startNavigation();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [startNavigation]);

  useEffect(() => {
    if (!isLoading) return;
    timeoutRef.current = setTimeout(() => stopNavigation(), 30_000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoading, stopNavigation]);

  return (
    <NavigationContext.Provider value={{ startNavigation }}>
      {isLoading && <SiteLoader />}
      {children}
    </NavigationContext.Provider>
  );
}