// src/constants/blog-topics.ts

// src/constants/blog-topics.ts
import type { BlogTopic } from "@/types/blog";

export const BLOG_TOPICS: BlogTopic[] = [
    { name: 'All Topics', slug: 'all-topics' }, // A default to show all posts
    // IMPORTANT: Replace the '0' with the ACTUAL numerical ID of your WordPress category for each topic.
    // How to find WordPress Category IDs:
    // 1. Log in to your WordPress.com dashboard.
    // 2. Go to Posts > Categories.
    // 3. Hover over the category name, and look for "tag_ID=[NUMBER]" in the URL that appears in your browser's status bar.
    { name: 'Prelims', slug: 'prelims', wordpressCategoryId: 0 as number }, // Replace 0 with your Prelims ID
    { name: 'Mains', slug: 'mains', wordpressCategoryId: 0 as number },     // Replace 0 with your Mains ID
    { name: 'Interview', slug: 'interview', wordpressCategoryId: 0 as number }, // Replace 0 with your Interview ID
    { name: 'General Questions', slug: 'general-questions', wordpressCategoryId: 0 as number }, // Replace 0 with your General Questions ID
    { name: 'Current Affairs', slug: 'current-affairs', wordpressCategoryId: 0 as number }, // Replace 0 with your Current Affairs ID
];