import React from 'react';
import Navigation from './Navigation';
import { useAppStore } from '@/store';
import CheckInReminder from '@/components/reminders/CheckInReminder';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { isOnboarding, sidebarOpen } = useAppStore();

    if (isOnboarding) {
        // If we're in onboarding, just show the children without any layout
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Navigation sidebar */}
            <Navigation />

            {/* Main content */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
                {/* Top bar */}
                <header className="bg-white shadow z-10">
                    <div className="px-4 py-3 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-gray-800">NeuroSpark</h1>

                        {/* This could hold profile options, notifications, etc. */}
                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                            </button>

                            <div className="bg-indigo-100 p-1 rounded-full">
                                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    NS
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Check-in reminder (dynamic) */}
                <CheckInReminder />

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
} 