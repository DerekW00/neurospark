import React from 'react';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
    size?: 'small' | 'medium' | 'large';
    text?: string;
}

export default function LoadingSpinner({
    fullScreen = false,
    size = 'medium',
    text = 'Loading...'
}: LoadingSpinnerProps) {
    const sizeClass = {
        small: 'w-4 h-4 border-2',
        medium: 'w-8 h-8 border-3',
        large: 'w-12 h-12 border-4'
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center">
            <div
                className={`${sizeClass[size]} rounded-full border-solid border-[var(--card-alt)] border-t-[var(--primary)] animate-spin`}
                role="status"
                aria-label="Loading"
            />
            {text && <p className="mt-2 text-[var(--muted-foreground)]">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)] bg-opacity-80 z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
} 