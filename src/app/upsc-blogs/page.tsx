// src/app/upsc-blogs/page.tsx

import { getBlogPosts, getBlogCategories } from '@/lib/wordpress';
import type { BlogPost, BlogTopic } from '@/types/blog';
import { TopicDropdown } from '@/components/blog/TopicDropdown';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { Separator } from '@/components/ui/separator';
import { PaginationControls } from '@/components/blog/PaginationControls'; // Assuming you have this
import Link from 'next/link';

export const revalidate = 3600; // Revalidate at most every hour
export const dynamic = 'force-dynamic'; // Ensures dynamic rendering for query parameters (like 'page')

const POSTS_PER_PAGE = 6; // Define posts per page constant

// This is a Server Component
export default async function UpscBlogsPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    // Await searchParams for Next.js 15 compatibility
    const awaitedSearchParams = await searchParams;
    const currentPage = Number(awaitedSearchParams?.page) || 1;

    // Fetch all categories (always needed for the dropdown in both pages)
    const allCategories: BlogTopic[] = await getBlogCategories();

    // Filter for top-level categories only for the dropdown
    const mainTopics: BlogTopic[] = [
        ...allCategories.filter(cat => cat.parent === 0 || !cat.parent)
    ].sort((a, b) => a.name.localeCompare(b.name));

    // Fetch ALL blog posts for the default /upsc-blogs route (no categoryIds passed)
    const posts: BlogPost[] = await getBlogPosts(undefined, currentPage, POSTS_PER_PAGE);

    // Fetch all posts again (without pagination) to get total count for pagination
    const allPostsForCount: BlogPost[] = await getBlogPosts(undefined);
    const totalPosts = allPostsForCount.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    const latestPost = posts.length > 0 ? posts[0] : null; // Get the latest post overall

    console.log("-----------------------------------------");
    console.log("Debug for /upsc-blogs/page.tsx (All Topics)");
    console.log("Current Page:", currentPage);
    console.log("Posts array length (for current page):", posts.length);
    if (posts.length > 0) {
        console.log("First post slug (for current page):", posts[0]?.slug);
    } else {
        console.log("No posts fetched for /upsc-blogs (All Topics).");
    }
    console.log("Total Posts (for count):", totalPosts);
    console.log("Total Pages:", totalPages);
    console.log("-----------------------------------------");

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">MentorGuru Blog - All Topics</h1>

            <div className="mb-8">
                {/* currentTopicSlug is undefined for the "All Topics" page */}
                <TopicDropdown topics={mainTopics} currentTopicSlug={undefined} />
            </div>

            {latestPost && (
                <>
                    <h2 className="text-3xl font-semibold mb-6">Latest Blog Post</h2>
                    {/* Using BlogPostCard for a summary view */}
                    <BlogPostCard post={latestPost} topicSlug={undefined} />
                    <Separator className="my-8" />
                </>
            )}

            <h2 className="text-3xl font-semibold mb-6">All Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    // Pass undefined for topicSlug as this is the 'All Topics' view
                    // The BlogPostCard should link to /blog/[postSlug]
                    <BlogPostCard key={post.id} post={post} topicSlug={undefined} />
                ))}
                {posts.length === 0 && (
                    <p className="col-span-full text-center text-gray-600">
                        No blog posts found.
                    </p>
                )}
            </div>

            {totalPages > 1 && (
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={`/upsc-blogs`} // Base URL for pagination on "All Topics" page
                />
            )}
        </div>
    );
}
