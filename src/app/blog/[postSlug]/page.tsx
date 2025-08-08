// src/app/blog/[postSlug]/page.tsx

import { getSingleBlogPost, getAllBlogPostSlugs } from '@/lib/wordpress';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate static pages at most every hour

// generateStaticParams runs at build time to pre-render individual post pages
export async function generateStaticParams() {
    console.log("generateStaticParams for [postSlug]: Fetching all post slugs for static generation...");
    const allSlugs = await getAllBlogPostSlugs();
    const params = allSlugs.map(slug => ({
        postSlug: slug,
    }));
    console.log("generateStaticParams for [postSlug]: Generated slugs:", params.map(p => p.postSlug));
    return params;
}

// Default export is a Server Component
export default async function SingleBlogPostPage({
    params,
    searchParams,
}: {
    params: { postSlug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    // Await params and searchParams for Next.js 15 compatibility
    const awaitedParams = await params;
    const { postSlug } = awaitedParams;

    const awaitedSearchParams = await searchParams;
    // Extract 'fromTopic' query parameter for the back link, if present
    const fromTopicSlug = typeof awaitedSearchParams?.fromTopic === 'string' ? awaitedSearchParams.fromTopic : undefined;

    console.log(`SingleBlogPostPage: Requested postSlug: ${postSlug}`);
    console.log(`SingleBlogPostPage: Came from topic: ${fromTopicSlug || 'unknown'}`); // Diagnostic log

    const post = await getSingleBlogPost(postSlug);

    console.log("SingleBlogPostPage: Post fetched:", post ? post.slug : "NOT FOUND");

    // If post is not found, render Next.js's 404 page
    if (!post) {
        console.error(`SingleBlogPostPage: Post with slug "${postSlug}" not found. Calling notFound().`);
        notFound();
    }

    // Dynamically set the back link href and text based on 'fromTopic'
    // This allows returning to the specific topic's blog list or the general list
    const backLinkHref = fromTopicSlug ? `/upsc-blogs/${fromTopicSlug}` : "/upsc-blogs";
    const backLinkText = fromTopicSlug ? `Back to ${fromTopicSlug.replace(/-/g, ' ')} Blogs` : "Back to all UPSC Blogs";

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href={backLinkHref} className="text-blue-600 hover:underline mb-4 inline-block">
                &larr; {backLinkText}
            </Link>
            {/* BlogPostContent is likely a Client Component or a Server Component that renders the post details */}
            <BlogPostContent post={post} />
        </div>
    );
}
