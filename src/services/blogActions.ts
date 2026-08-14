// services/blogActions.ts
import api from "./api";
import { BlogCategoryNode } from "@/types/categories";
import { fixImageUrl } from "@/lib/urls";

function processArticleImages(article: any): any {
  if (!article) return article;
  
  return {
    ...article,
    cover_image: fixImageUrl(article.cover_image),
    image: fixImageUrl(article.image || article.cover_image),
    thumbnail: fixImageUrl(article.thumbnail),
  };
}

function extractDataFromResponse(response: any): any[] {
  if (!response) return [];
  
  // اگر مستقیم آرایه است
  if (Array.isArray(response)) {
    return response.map(processArticleImages);
  }
  
  // اگر در property data است
  if (response.data && Array.isArray(response.data)) {
    return response.data.map(processArticleImages);
  }
  
  // اگر در property results است (pagination)
  if (response.results && Array.isArray(response.results)) {
    return response.results.map(processArticleImages);
  }
  
  // اگر در property posts است
  if (response.posts && Array.isArray(response.posts)) {
    return response.posts.map(processArticleImages);
  }
  
  // اگر در property items است
  if (response.items && Array.isArray(response.items)) {
    return response.items.map(processArticleImages);
  }
  
  return [];
}

export async function GetLatestBlogPosts(limit: number = 6) {
  try {
    console.log(`📝 Getting latest ${limit} blog posts...`);
    
    const response = await api.get(`/blog/posts/latest/?limit=${limit}`);
    console.log("✅ API Response received:", response.status);
    
    const articles = extractDataFromResponse(response.data);
    console.log(`📚 Extracted ${articles.length} articles`);
    
    // اگر مقاله‌ای دریافت نشد، از endpoint جایگزین استفاده کن
    if (articles.length === 0) {
      console.log("⚠️ No articles in latest, trying fallback endpoint...");
      const fallbackResponse = await api.get(`/blog/posts/?limit=${limit}`);
      const fallbackArticles = extractDataFromResponse(fallbackResponse.data);
      console.log(`📚 Fallback: ${fallbackArticles.length} articles`);
      return fallbackArticles;
    }
    
    return articles;
  } catch (error) {
    console.error("❌ GetLatestBlogPosts error:", error);
    return [];
  }
}

// ✅ تابع GetBlogPosts - برای صفحات لیست مقالات با پیجینیشن
export async function GetBlogPosts(params?: { category?: string; page?: number; limit?: number }) {
  try {
    const query = new URLSearchParams();
    
    if (params?.category) query.append("category", params.category);
    if (params?.page) query.append("page", (params.page || 1).toString());
    if (params?.limit) query.append("limit", (params.limit || 10).toString());
    
    const queryString = query.toString();
    const url = `/blog/posts/${queryString ? `?${queryString}` : ''}`;
    
    console.log(`📝 Getting blog posts with params:`, params);
    
    const response = await api.get(url);
    const data = response.data;
    
    const articles = extractDataFromResponse(data);
    
    // استخراج اطلاعات pagination
    const total_pages = data?.total_pages || data?.page_count || Math.ceil((data?.count || articles.length) / (params?.limit || 10));
    const current_page = params?.page || 1;
    const count = data?.count || data?.total || articles.length;
    
    return {
      data: articles,
      total_pages: total_pages,
      current_page: current_page,
      count: count,
      next: data?.next || null,
      previous: data?.previous || null,
    };
  } catch (error) {
    console.error("❌ GetBlogPosts error:", error);
    return {
      data: [],
      total_pages: 1,
      current_page: 1,
      count: 0,
      next: null,
      previous: null,
    };
  }
}

export async function GetBlogCategoriesMenuStructure(): Promise<BlogCategoryNode[]> {
  try {
    const response = await api.get("/blog/categories/menu_structure/");
    const data = response.data;
    
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.results && Array.isArray(data.results)) return data.results;
    
    return [];
  } catch (error) {
    console.error("❌ GetBlogCategoriesMenuStructure error:", error);
    return [];
  }
}

export async function GetBlogBySlug(slug: string) {
  try {
    const response = await api.get(`/blog/posts/${slug}/`);
    return processArticleImages(response.data);
  } catch (error) {
    console.error(`❌ GetBlogBySlug error for ${slug}:`, error);
    return null;
  }
}

export async function SearchBlogs(searchTerm: string, page: number = 1) {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    const response = await api.get(
      `/blog/posts/search/?q=${encodeURIComponent(searchTerm)}&page=${page}`,
      { skipRetry: true, timeout: 10000 } as any
    );
    return extractDataFromResponse(response.data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      const message = error instanceof Error ? error.message : "search failed";
      console.warn("SearchBlogs:", message);
    }
    return [];
  }
}

export async function GetBlogPostsByCategory(categorySlug: string, page: number = 1) {
  try {
    const response = await api.get(`/blog/categories/${categorySlug}/?page=${page}`);
    const data = response.data;
    
    return {
      category: data?.category || null,
      posts: extractDataFromResponse(data?.posts || data),
      total_pages: data?.total_pages || 1,
      current_page: page,
    };
  } catch (error) {
    console.error(`❌ GetBlogPostsByCategory error for ${categorySlug}:`, error);
    return { category: null, posts: [], total_pages: 1, current_page: page };
  }
}