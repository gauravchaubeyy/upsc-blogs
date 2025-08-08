// src/components/blog/BlogPostCard.tsx
// This component displays a summary card for a blog post.

import Link from 'next/link';
import Image from 'next/image'; // Assuming you use Next.js Image component
import type { BlogPost } from '@/types/blog'; // Import BlogPost type
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Define the props for BlogPostCard
interface BlogPostCardProps {
    post: BlogPost; // The blog post data to display
    topicSlug?: string; // Make topicSlug optional (string or undefined)
}

export function BlogPostCard({ post, topicSlug }: BlogPostCardProps) {
    // Determine the base URL for linking to the individual blog post
    // If topicSlug is provided, append it as a search parameter for the back link
    const postLinkHref = topicSlug
        ? `/blog/${post.slug}?fromTopic=${topicSlug}`
        : `/blog/${post.slug}`;

    return (
        <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
            {post.featuredImageUrl && (
                <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                    <Image
                        src={post.featuredImageUrl}
                        alt={typeof post.title === 'string' ? post.title : post.title.rendered} // Handle string or object title
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="transition-opacity duration-300 group-hover:opacity-80"
                        // Add error handling for image loading
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevents infinite loop
                            // Fallback to a placeholder image or hide the image
                            target.src = `https://placehold.co/600x400/cccccc/333333?text=No+Image`;
                            target.alt = "Image not available";
                        }}
                    />
                </div>
            )}
            <CardHeader className="flex-grow">
                <CardTitle className="text-xl font-semibold leading-tight line-clamp-2">
                    {typeof post.title === 'string' ? post.title : post.title.rendered}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 mt-1">
                    Published on: {new Date(post.date).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {/* Display excerpt, cleaning up HTML if necessary */}
                <div
                    className="text-gray-700 text-base line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: typeof post.excerpt === 'string' ? post.excerpt : post.excerpt.rendered }}
                />
            </CardContent>
            <CardFooter className="p-4">
                <Link href={postLinkHref} passHref>
                    <Button variant="link" className="text-blue-600 hover:underline px-0">
                        Read More &rarr;
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
