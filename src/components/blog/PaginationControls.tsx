// src/components/blog/PaginationControls.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string; // The base URL for the page (e.g., /blog/prelims)
}

export function PaginationControls({ currentPage, totalPages, baseUrl }: PaginationControlsProps) {
    const router = useRouter();

    const handlePageChange = (page: number) => {
        router.push(`${baseUrl}?page=${page}`);
    };

    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                Previous
            </Button>

            {/* Render page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? 'default' : 'outline'}
                    onClick={() => handlePageChange(pageNumber)}
                    className="hidden sm:inline-flex" // Hide on small screens for brevity
                >
                    {pageNumber}
                </Button>
            ))}

            <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                Next
            </Button>
        </div>
    );
}