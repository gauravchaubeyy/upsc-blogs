// src/components/blog/TopicDropdown.tsx

'use client'; // This directive is necessary for client-side components in Next.js App Router

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname
import type { BlogTopic } from '@/types/blog'; // Import your BlogTopic type

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface TopicDropdownProps {
    topics: BlogTopic[]; // Expects the array of blog topics (e.g., from BLOG_TOPICS constant)
    currentTopicSlug?: string; // The slug of the currently active topic, if any, passed from parent page
}

export function TopicDropdown({ topics, currentTopicSlug }: TopicDropdownProps) {
    const router = useRouter(); // Hook to programmatically navigate
    const pathname = usePathname(); // Hook to get the current URL path

    // Determine the currently selected topic to display in the dropdown trigger
    // It finds the topic matching the current URL slug, or defaults to "All Topics"
    const selectedTopic = topics.find(topic => topic.slug === currentTopicSlug) ||
        // Fallback: If currentTopicSlug is undefined or doesn't match, check for an 'all-topics' entry in your list
        topics.find(topic => topic.slug === 'all-topics') ||
        // Final fallback: A generic "All Topics" object
        { name: 'All Topics', slug: 'all-topics', wordpressCategoryId: undefined, parent: undefined };


    // Function to handle when a user selects an item from the dropdown
    const handleTopicChange = (slug: string) => {
        if (slug === 'all-topics' || slug === undefined) { // Check for 'all-topics' slug or if it's undefined
            // If "All Topics" is selected, navigate to the base UPSC blog URL
            // This will load src/app/upsc-blogs/page.tsx
            router.push('/upsc-blogs');
        } else {
            // For a specific topic, navigate to its dynamic route under /upsc-blogs
            // This will load src/app/upsc-blogs/[topicSlug]/page.tsx
            router.push(`/upsc-blogs/${slug}`);
        }
        // Radix UI (which ShadCN uses) generally handles closing the dropdown on MenuItem 'onSelect'
    };

    return (
        <DropdownMenu>
            {/* The trigger button for the dropdown menu */}
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                    {selectedTopic.name} {/* Display the name of the selected topic */}
                    <span className="ml-2">&#9662;</span> {/* Unicode character for a dropdown arrow */}
                </Button>
            </DropdownMenuTrigger>

            {/* The content of the dropdown menu */}
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                {/* Always include an "All Topics" option if it's not already generated from WordPress categories */}
                {!topics.some(topic => topic.slug === 'all-topics') && (
                    <DropdownMenuItem
                        key="all-topics-option"
                        onSelect={() => handleTopicChange('all-topics')}
                        // Highlight "All Topics" if currentTopicSlug is not set (i.e., on the /upsc-blogs page)
                        className={!currentTopicSlug ? 'bg-accent text-accent-foreground' : ''}
                    >
                        All Topics
                    </DropdownMenuItem>
                )}

                {/* Map through the fetched topics to create dropdown items */}
                {topics.map((topic) => (
                    // Avoid duplicating an 'all-topics' item if it somehow exists in the WordPress categories
                    topic.slug !== 'all-topics' && (
                        <DropdownMenuItem
                            key={topic.slug} // Unique key for each dropdown item
                            onSelect={() => handleTopicChange(topic.slug)} // Handles navigation on select
                            // Highlight the currently active topic in the dropdown list
                            className={currentTopicSlug === topic.slug ? 'bg-accent text-accent-foreground' : ''}
                        >
                            {topic.name} {/* This is the text displayed for each dropdown item */}
                        </DropdownMenuItem>
                    )
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
