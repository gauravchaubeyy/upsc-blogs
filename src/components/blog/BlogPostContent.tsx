// src/components/blog/BlogPostContent.tsx

import * as React from 'react';
import type { BlogPost } from '@/types/blog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface BlogPostContentProps {
    post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
    // --- ADD THIS CONSOLE LOG TO CHECK THE IMAGE URL ---
    console.log("BlogPostContent: post.featuredImageUrl:", post.featuredImageUrl);

    const titleHtml = post.title || '';
    const contentHtml = post.content || '';
    const postDate = post.date ? new Date(post.date) : new Date();

    const termsArray = post._embedded?.['wp:term']?.[0] || [];
    const categoryNames = termsArray
        .filter(term => term.taxonomy === 'category')
        .map(term => term.name)
        .join(', ');

    return (
        <Card className="w-full flex flex-col">
            <CardHeader>
                <CardTitle dangerouslySetInnerHTML={{ __html: titleHtml }} />
                <CardDescription>
                    Published on {format(postDate, 'MMMM dd,yyyy')}
                    {categoryNames && (
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-400">
                            ({categoryNames})
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* --- ADD THIS SECTION FOR FEATURED IMAGE --- */}
                {post.featuredImageUrl && (
                    <div className="mb-6"> {/* Add some margin below the image */}
                        <img
                            src={post.featuredImageUrl}
                            alt={post.title || 'Featured Image'} // Use title as alt text for accessibility
                            className="w-full h-auto object-cover rounded-lg shadow-md" // Basic Tailwind styling
                        />
                    </div>
                )}
                {/* --- END FEATURED IMAGE SECTION --- */}

                {/* The main content area (images here will render automatically) */}
                <div
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                    className="prose prose-lg max-w-none dark:prose-invert"
                />
            </CardContent>
        </Card>
    );
}