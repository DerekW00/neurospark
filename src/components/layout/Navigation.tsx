import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store';
import {
    HomeIcon,
    CalendarIcon,
    CheckCircleIcon,
    CogIcon,
    ChartBarIcon,
    BoltIcon
} from '@heroicons/react/24/outline';

export default function Navigation() {
    const pathname = usePathname();
    const { isOnboarding, sidebarOpen, toggleSidebar } = useAppStore();

    // If we're in onboarding, don't show the navigation
    if (isOnboarding) return null;

    const navItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: HomeIcon,
            current: pathname === '/dashboard',
        },
        {
            name: 'Tasks',
            href: '/tasks',
            icon: CheckCircleIcon,
            current: pathname.startsWith('/tasks'),
        },
        {
            name: 'Calendar',
            href: '/calendar',
            icon: CalendarIcon,
            current: pathname === '/calendar',
        },
        {
            name: 'Energy',
            href: '/energy',
            icon: BoltIcon,
            current: pathname === '/energy',
        },
        {
            name: 'Progress',
            href: '/progress',
            icon: ChartBarIcon,
            current: pathname === '/progress',
        },
        {
            name: 'Settings',
            href: '/settings',
            icon: CogIcon,
            current: pathname === '/settings',
        },
    ];

    return (
        <div className={`h-full bg-[var(--primary)] text-white ${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 flex flex-col`}>
            <div className="flex items-center justify-between p-4">
                {sidebarOpen && (
                    <div className="text-xl font-bold">NeuroSpark</div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md hover:bg-[rgba(255,255,255,0.15)] transition-colors"
                >
                    {sidebarOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                        </svg>
                    )}
                </button>
            </div>

            <nav className="mt-8 flex-1">
                <ul className="space-y-2 px-2">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`flex items-center p-3 rounded-md transition-colors ${item.current
                                    ? 'bg-[rgba(255,255,255,0.2)] text-white'
                                    : 'text-white hover:bg-[rgba(255,255,255,0.1)]'
                                    }`}
                            >
                                <item.icon className="w-6 h-6 flex-shrink-0" />
                                {sidebarOpen && (
                                    <span className="ml-4">{item.name}</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4">
                <div className={`p-3 bg-[rgba(255,255,255,0.15)] rounded-md ${sidebarOpen ? 'flex items-center' : 'flex justify-center'}`}>
                    <BoltIcon className="h-6 w-6 text-white" />
                    {sidebarOpen && (
                        <div className="ml-3">
                            <div className="text-sm font-medium">Energy Level</div>
                            <Link href="/energy" className="text-xs text-white opacity-80 hover:opacity-100">
                                Log today
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 