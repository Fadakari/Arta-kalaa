import { GetBlogCategoriesMenuStructure, GetBlogPosts } from "@/services/blogActions";
import { GetProducts, GetShopCategoriesTreeList } from "@/services/shopActions";
import { BlogCategoryNode, CategoryNode } from "@/types/categories";
import ProductType from "@/types/product";
import { MetadataRoute } from "next";
import jalaali from "jalaali-js";
import Article from "@/types/blog";

/** Generated at request time so build does not wait on slow/unreliable API pagination. */
export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://artakalaa.com";
const MAX_SITEMAP_PAGES = 25;

function convertJalaliToDate(jalaliStr: string): Date {
    const [jy, jm, jd] = jalaliStr.replace(/[۰-۹]/g, d => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).split("/").map(Number);
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    return new Date(gy, gm - 1, gd);
}

async function getSitemapProducts(): Promise<ProductType[]> {
    const allProducts: ProductType[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= MAX_SITEMAP_PAGES) {
        const res = await GetProducts({}, page);
        allProducts.push(...res.results);
        page++;
        hasMore = Boolean(res.next) && res.results.length > 0;
    }

    return allProducts;
}

async function getSitemapBlogPosts(): Promise<Article[]> {
    const allPosts: Article[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= MAX_SITEMAP_PAGES) {
        const res = await GetBlogPosts({ page });
        if (!res?.data?.length) break;
        allPosts.push(...res.data);
        page++;
        hasMore = Boolean(res.next) && page <= (res.total_pages || MAX_SITEMAP_PAGES);
    }

    return allPosts;
}

const staticEntries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/products`, lastModified: new Date() },
    { url: `${baseUrl}/articles`, lastModified: new Date() },
    { url: `${baseUrl}/gallery`, lastModified: new Date("2025-01-03") },
    { url: `${baseUrl}/about-us`, lastModified: new Date("2025-01-01") },
    { url: `${baseUrl}/contact-info`, lastModified: new Date("2025-01-02") },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
    const [rawCategories, blogPosts, products, categoriesData] = await Promise.all([
        GetBlogCategoriesMenuStructure(),
        getSitemapBlogPosts(),
        getSitemapProducts(),
        GetShopCategoriesTreeList(),
    ]);

    const blogcategories: BlogCategoryNode[] = Array.isArray(rawCategories) ? rawCategories : [];
    const categoryItems: CategoryNode[] = categoriesData?.data || [];

    const sitemap: MetadataRoute.Sitemap = [...staticEntries];

    blogPosts.forEach((post: Article) => {
        sitemap.push({
            url: `${baseUrl}/articles/${post.slug}`,
            lastModified: convertJalaliToDate(post.jalali_created),
        });
    });

    blogcategories.forEach((blog) => {
        sitemap.push({ url: `${baseUrl}/articles?category=${blog.slug}`, lastModified: new Date() });
        blog.children?.forEach(blogChild => {
            sitemap.push({
                url: `${baseUrl}/articles?category=${blogChild.slug}`,
                lastModified: new Date(),
            });
        });
    });

    products.forEach((product: ProductType) => {
        sitemap.push({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: new Date(),
        });
    });

    categoryItems.forEach((category: CategoryNode) => {
        sitemap.push({ url: `${baseUrl}/products?category_id=${category.id}`, lastModified: new Date() });
        category.children?.forEach(childcategory => {
            sitemap.push({
                url: `${baseUrl}/products?category_id=${childcategory.id}`,
                lastModified: new Date(),
            });
        });
    });

    return sitemap;
    } catch {
        return [...staticEntries];
    }
}
