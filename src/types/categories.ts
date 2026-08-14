export type CategoryNode = {
    id: number | string;
    name: string;
    slug: string;
    children?: CategoryNode[];
};

export type BlogCategoryNode = {
    id: number,
    title: string,
    slug: string,
    children: BlogCategoryNode[],
    parent_slug: string
}
