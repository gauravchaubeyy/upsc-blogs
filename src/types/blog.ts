// src/types/blog.ts

// Defines the structure for a single blog post fetched from WordPress
export interface BlogPost {
    ID: number; // The primary WordPress ID for the post
    id: number; // Keeping 'id' for consistency, often mapped from 'ID'
    site_ID: number;
    author: any; // Can be detailed, using 'any' for brevity
    date: string; // Post publication date (ISO 8601)
    modified: string; // Last modified date (ISO 8601)
    slug: string; // The URL-friendly slug of the post
    guid: string;
    status: string;
    type: string;
    URL: string; // Canonical URL of the post
    short_URL: string;
    global_ID: string;
    featured_image: string; // Direct URL to the featured image, if set

    // IMPORTANT: These are typically objects from WordPress API with a 'rendered' property
    title: { rendered: string } | string; // Can be object or already processed string
    content: { rendered: string } | string;
    excerpt: { rendered: string } | string;

    discussion: any;
    likes_enabled: boolean;
    sharing_enabled: boolean;
    like_count: number;
    i_like: boolean;
    is_reblogged: boolean;
    is_following: boolean;
    post_thumbnail: any; // Can be detailed, using 'any' for brevity
    format: string;
    geo: boolean;
    menu_order: number;
    page_template: string;
    publicize_URLs: any[];
    terms: any; // Contains categories and tags as objects
    tags: any; // Detailed tags structure
    categories: any; // Detailed categories structure
    attachments: any;
    attachment_count: number;
    metadata: any[];
    meta: any;
    capabilities: any;
    other_URLs: any;

    featuredImageUrl?: string; // Custom property derived from _embedded or featured_image

    // WordPress _embedded field, containing related resources like featured media, terms (categories/tags)
    _embedded?: {
        'wp:term'?: Array<Array<{ // Array of arrays for terms
            taxonomy: string;
            id?: number; // WordPress term ID
            name: string;
            slug: string;
        }>>;
        'wp:featuredmedia'?: Array<Array<{ // Array of arrays for featured media
            id: number;
            source_url: string; // URL of the featured image
        }>>;
    };
}

// Defines the structure for a blog topic/category
export interface BlogTopic {
    name: string; // Display name of the topic/category
    slug: string; // URL-friendly slug of the topic/category
    wordpressCategoryId?: number; // The unique WordPress ID for this category
    parent?: number; // The WordPress ID of the parent category, if it's a subcategory
}
