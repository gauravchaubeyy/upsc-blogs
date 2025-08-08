// src/app/blog/page.tsx

import { getBlogCategories } from '@/lib/wordpress';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate at most every hour

// This is a Server Component
export default async function BlogPage() {
    // Only fetch categories to display topic links
    const allCategories = await getBlogCategories();

    // Filter for top-level categories only for display
    const mainTopics = [
        ...allCategories.filter(cat => cat.parent === 0 || !cat.parent)
    ].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <main className="flex min-h-screen flex-col items-center bg-neutral-900 text-white p-8">
            <div className="container flex flex-col items-center justify-center gap-6 px-4 py-8 text-center">
                <h1 className="text-5xl font-bold tracking-tight sm:text-[5rem]">
                    MentorGuru <span className="text-blue-500">Blog</span>
                </h1>
                <p className="text-lg mt-4 max-w-2xl">
                    Welcome to the MentorGuru Blog, your comprehensive resource for UPSC preparation.
                    Explore articles across various topics to enhance your understanding and strategy.
                </p>
            </div>

            <div className="mt-8 w-full max-w-4xl px-4">
                <h2 className="text-3xl font-semibold mb-6 text-center">Explore Topics</h2>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {/* Link to the 'All Topics' view */}
                    <Link
                        href="/upsc-blogs"
                        className="flex items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 p-4 text-lg font-medium
                                   hover:bg-neutral-700 hover:border-blue-500 transition-colors duration-200 shadow-lg"
                    >
                        All Topics
                    </Link>
                    {/* Link to specific topic pages under /upsc-blogs/[topicSlug] */}
                    {mainTopics.map((topic) => (
                        <Link
                            key={topic.slug}
                            href={`/upsc-blogs/${topic.slug}`}
                            className="flex items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 p-4 text-lg font-medium
                                       hover:bg-neutral-700 hover:border-blue-500 transition-colors duration-200 shadow-lg"
                        >
                            {topic.name}
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
