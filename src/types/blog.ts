import { BlogCategoryNode } from "./categories";

export default interface Article {
  readonly id: number;

  title: string;

  slug: string;

  reading_time?: string | null;

  readonly thumbnail: string;

  introduction?: string | null;

  readonly jalali_created: string;

  readonly created_at_relative: string;
  category: BlogCategoryNode
}
