// src/app/upsc-blogs/[topicSlug]/page.tsx

import { getBlogPosts, getBlogCategories } from '@/lib/wordpress';
import type { BlogPost } from '@/types/blog';
import type { BlogTopic } from '@/types/blog';
import { TopicDropdown } from '@/components/blog/TopicDropdown';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { Separator } from '@/components/ui/separator';
import { PaginationControls } from '@/components/blog/PaginationControls';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

const POSTS_PER_PAGE = 6;

export async function generateStaticParams() {
    console.log("generateStaticParams for [topicSlug]: Fetching all categories for static topic paths...");
    const allCategories = await getBlogCategories();
    const topLevelSlugs = allCategories.filter(cat => cat.parent === 0 || typeof cat.parent === 'undefined' || cat.parent === null)
        .map((topic) => ({
            topicSlug: topic.slug,
        }));
    console.log("generateStaticParams for [topicSlug]: Generated slugs:", topLevelSlugs.map(p => p.topicSlug));
    return topLevelSlugs;
}

export default async function TopicBlogPage({
    params,
    searchParams,
}: {
    params: { topicSlug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const awaitedParams = await params;
    const { topicSlug } = awaitedParams;

    const awaitedSearchParams = await searchParams;
    const currentPage = Number(awaitedSearchParams?.page) || 1;

    console.log(`\n--- TOPIC PAGE RENDER START: ${topicSlug} (Page ${currentPage}) ---`); // NEW diagnostic
    console.log(`URL Param topicSlug: "${topicSlug}"`); // NEW diagnostic

    const allCategories = await getBlogCategories();
    console.log(`getBlogCategories returned ${allCategories.length} categories.`); // NEW diagnostic
    // console.log("All Categories Data:", allCategories.map(c => ({ name: c.name, slug: c.slug, id: c.wordpressCategoryId, parent: c.parent }))); // OPTIONAL: too verbose, uncomment if needed

    const filteredCategories = allCategories.filter(cat =>
        cat.parent === 0 || typeof cat.parent === 'undefined' || cat.parent === null
    );
    const sortedCategories = filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
    const mainTopics: BlogTopic[] = sortedCategories;

    console.log(`Main Topics for Dropdown (${mainTopics.length}):`, mainTopics.map(t => t.slug)); // NEW diagnostic

    const currentTopic = mainTopics.find((topic) => topic.slug === topicSlug);

    if (!currentTopic) {
        console.error(`ERROR: Current topic not found for slug "${topicSlug}". All available main topics:`, mainTopics.map(t => t.slug)); // NEW diagnostic
        notFound(); // Trigger 404 for invalid topic slugs
    }
    console.log(`Identified currentTopic: "${currentTopic.name}" (ID: ${currentTopic.wordpressCategoryId})`); // NEW diagnostic

    let categoryIdsToFetch: number[] = [];

    if (currentTopic.wordpressCategoryId !== undefined) {
        categoryIdsToFetch = [currentTopic.wordpressCategoryId];

        const subCategories = allCategories.filter(
            (cat) => cat.parent === currentTopic.wordpressCategoryId
        );

        if (subCategories.length > 0) {
            const subCategoryIds = subCategories
                .map((cat) => cat.wordpressCategoryId)
                .filter((id): id is number => id !== undefined); // Filter out any undefined IDs
            categoryIdsToFetch = [...categoryIdsToFetch, ...subCategoryIds];
            console.log(`Including ${subCategoryIds.length} subcategories. Total IDs: ${categoryIdsToFetch}`); // NEW diagnostic
        }
    } else {
        console.warn(`WARN: Topic "${topicSlug}" has no associated WordPress Category ID. No posts will be fetched based on category.`); // NEW diagnostic
        categoryIdsToFetch = [];
    }

    console.log(`Category IDs being passed to getBlogPosts: [${categoryIdsToFetch.join(', ')}]`); // NEW CRITICAL diagnostic

    const posts: BlogPost[] = await getBlogPosts(categoryIdsToFetch, currentPage, POSTS_PER_PAGE);
    const allPostsForCount: BlogPost[] = await getBlogPosts(categoryIdsToFetch);

    const totalPosts = allPostsForCount.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    const latestPostForTopic = posts.length > 0 ? posts[0] : null;

    console.log(`getBlogPosts returned ${posts.length} posts for current page.`); // NEW diagnostic
    if (posts.length > 0) {
        console.log(`First post in fetched batch: "${posts[0]?.title}" (ID: ${posts[0]?.id})`); // NEW diagnostic
    } else {
        console.log("No posts found for this topic and page."); // NEW diagnostic
    }
    console.log(`Total Posts (for pagination count): ${totalPosts}, Total Pages: ${totalPages}`); // NEW diagnostic
    console.log("--- TOPIC PAGE RENDER END --- \n"); // NEW diagnostic

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">MentorGuru Blog - {currentTopic.name}</h1>

            <div className="mb-8">
                <TopicDropdown topics={mainTopics} currentTopicSlug={topicSlug} />
            </div>

            {latestPostForTopic && (
                <>
                    <h2 className="text-3xl font-semibold mb-6">Latest Post in {currentTopic.name}</h2>
                    <BlogPostContent post={latestPostForTopic} />
                    <Separator className="my-8" />
                </>
            )}

            <h2 className="text-3xl font-semibold mb-6">All Posts in {currentTopic.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} topicSlug={topicSlug} />
                ))}
                {posts.length === 0 && (
                    <p className="col-span-full text-center text-gray-600">
                        No blog posts found for this topic on this page.
                    </p>
                )}
            </div>

            {totalPages > 1 && (
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={`/upsc-blogs/${topicSlug}`}
                />
            )}
        </div>
    );
}
