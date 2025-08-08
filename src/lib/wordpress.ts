// src/lib/wordpress.ts

import type { BlogPost, BlogTopic } from '@/types/blog';
import axios from 'axios';

// Base URL for the WordPress.com REST API
const WORDPRESS_API_BASE_URL = "https://public-api.wordpress.com/rest/v1.1/sites/upscblogs0.wordpress.com/";

// Basic check for API URL, though it's hardcoded here.
if (!WORDPRESS_API_BASE_URL) {
    throw new Error('WORDPRESS_API_BASE_URL is not defined. Please check your configuration.');
}

// Axios configuration (empty for now, but can be extended for headers, auth, etc.)
const axiosConfig = {};

/**
 * Fetches blog posts from WordPress.
 * @param categoryIds An optional array of category IDs to filter posts. If undefined or empty, fetches all posts.
 * @param page The page number to retrieve.
 * @param perPage The number of posts per page.
 * @returns A promise that resolves to an array of BlogPost objects.
 */
export async function getBlogPosts(
    categoryIds?: number[], // Optional array of category IDs
    page: number = 1,
    perPage: number = 10
): Promise<BlogPost[]> {
    // Construct the base URL for posts with embedding (for featured media, etc.)
    let url = `${WORDPRESS_API_BASE_URL}posts?_embed&page=${page}&per_page=${perPage}`;

    // Add category filter if categoryIds are provided and not empty
    if (categoryIds && categoryIds.length > 0) {
        url += `&categories=${categoryIds.join(',')}`;
        console.log(`getBlogPosts: Fetching for specific categories: ${categoryIds.join(',')}`); // Diagnostic
    } else {
        console.log("getBlogPosts: No specific category IDs provided. Fetching all posts."); // Diagnostic
    }
    // Order posts by date in descending order (latest first)
    url += `&orderby=date&order=desc`;

    try {
        const response = await axios.get(url, axiosConfig);

        // WordPress API can return an array directly or a nested 'posts' array
        let rawPosts: any[] = Array.isArray(response.data)
            ? response.data
            : (response.data.posts && Array.isArray(response.data.posts) ? response.data.posts : []);

        // Map raw WordPress post data to your BlogPost interface
        const posts: BlogPost[] = rawPosts.map(rawPost => {
            let featuredImageUrl: string | undefined;
            // Check for featured media in the _embedded field first
            const featuredMedia = rawPost._embedded?.['wp:featuredmedia']?.[0]?.[0];
            if (featuredMedia && featuredMedia.source_url) {
                featuredImageUrl = featuredMedia.source_url;
            } else if (rawPost.featured_image) {
                // Fallback to 'featured_image' field if _embedded is not available
                featuredImageUrl = rawPost.featured_image;
            }

            return {
                ...rawPost, // Spread all raw properties
                id: rawPost.ID, // Use WordPress's 'ID' as your primary 'id'
                // Access 'rendered' property for content fields as per WordPress API standard
                title: rawPost.title?.rendered || rawPost.title,
                content: rawPost.content?.rendered || rawPost.content,
                excerpt: rawPost.excerpt?.rendered || rawPost.excerpt,
                featuredImageUrl: featuredImageUrl, // Your custom derived property
            } as BlogPost; // Cast to BlogPost type
        });

        console.log(`getBlogPosts: Fetched ${posts.length} posts for URL: ${url}`); // Diagnostic
        return posts;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error fetching blog posts from WordPress (URL: ${url}): ${error.message}`);
            if (error.response) {
                console.error(`Status: ${error.response.status}, Data:`, error.response.data);
            }
        } else {
            console.error("Unknown error fetching blog posts from WordPress:", error);
        }
        return []; // Return empty array on error
    }
}

/**
 * Fetches all blog post slugs for static path generation.
 * @returns A promise that resolves to an array of post slugs.
 */
export async function getAllBlogPostSlugs(): Promise<string[]> {
    const url = `${WORDPRESS_API_BASE_URL}posts?fields=slug&per_page=100`; // Fetch up to 100 slugs
    try {
        const response = await axios.get(url, axiosConfig);
        let rawPosts: any[] = Array.isArray(response.data)
            ? response.data
            : (response.data.posts && Array.isArray(response.data.posts) ? response.data.posts : []);
        console.log(`getAllBlogPostSlugs: Fetched ${rawPosts.length} slugs.`); // Diagnostic
        return rawPosts.map(post => post.slug);
    } catch (error) {
        console.error("Error fetching all blog post slugs for generateStaticParams:", error);
        return [];
    }
}

/**
 * Fetches a single blog post by its slug.
 * @param slug The slug of the blog post.
 * @returns A promise that resolves to a BlogPost object or null if not found.
 */
export async function getSingleBlogPost(slug: string): Promise<BlogPost | null> {
    const url = `${WORDPRESS_API_BASE_URL}posts?_embed&slug=${slug}`; // Fetch by slug with embedding

    try {
        const response = await axios.get(url, axiosConfig);
        let rawPosts: any[] = Array.isArray(response.data)
            ? response.data
            : (response.data.posts && Array.isArray(response.data.posts) ? response.data.posts : []);

        if (rawPosts.length > 0) {
            const rawPost = rawPosts[0]; // Get the first (and likely only) post found by slug

            let featuredImageUrl: string | undefined;
            const featuredMedia = rawPost._embedded?.['wp:featuredmedia']?.[0]?.[0];
            if (featuredMedia && featuredMedia.source_url) {
                featuredImageUrl = featuredMedia.source_url;
            } else if (rawPost.featured_image) {
                featuredImageUrl = rawPost.featured_image;
            }

            const post = {
                ...rawPost,
                id: rawPost.ID,
                title: rawPost.title?.rendered || rawPost.title,
                content: rawPost.content?.rendered || rawPost.content,
                excerpt: rawPost.excerpt?.rendered || rawPost.excerpt,
                featuredImageUrl: featuredImageUrl,
            } as BlogPost;
            console.log(`getSingleBlogPost: Fetched post for slug "${slug}".`); // Diagnostic
            return post;
        }
        console.warn(`getSingleBlogPost: No post found for slug "${slug}".`); // Diagnostic
        return null; // Return null if no post is found
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error fetching single blog post by slug (${slug}) from WordPress: ${error.message}`);
            if (error.response) {
                console.error(`Status: ${error.response.status}, Data:`, error.response.data);
            }
        } else {
            console.error("Unknown error fetching single blog post:", error);
        }
        return null; // Return null on error
    }
}

/**
 * Fetches blog categories from WordPress.
 * @returns A promise that resolves to an array of BlogTopic objects.
 */
export async function getBlogCategories(): Promise<BlogTopic[]> {
    // Fetch up to 100 categories, ordered by post count descending
    const url = `${WORDPRESS_API_BASE_URL}categories?per_page=100&orderby=count&order=desc`;

    try {
        const response = await axios.get(url, axiosConfig);
        // WordPress.com API for categories might return a direct array or a nested 'categories' array
        const categoriesData: any[] = Array.isArray(response.data)
            ? response.data
            : (response.data.categories && Array.isArray(response.data.categories)
                ? response.data.categories
                : []);

        // Map raw category data to your BlogTopic interface
        const mappedCategories: BlogTopic[] = categoriesData.map(cat => ({
            name: cat.name,
            slug: cat.slug,
            // Use 'ID' from WordPress API for the wordpressCategoryId
            wordpressCategoryId: (cat.ID === null || cat.ID === undefined) ? undefined : cat.ID,
            // Use 'parent' from WordPress API for category hierarchy
            parent: (cat.parent === null || cat.parent === undefined) ? undefined : cat.parent
        }));
        console.log(`getBlogCategories: Fetched ${mappedCategories.length} categories.`); // Diagnostic
        return mappedCategories;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error fetching blog categories from WordPress: ${error.message}`);
            if (error.response) {
                console.error(`Status: ${error.response.status}, Data:`, error.response.data);
            }
        } else {
            console.error("Unknown error fetching blog categories from WordPress:", error);
        }
        return []; // Return empty array on error
    }
}
