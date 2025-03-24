'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAppStore } from '@/store';

export default function SettingsPage() {
    const { calendarConnected, setCalendarConnected } = useAppStore();

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-lg font-medium text-gray-900">App Preferences</h2>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Configure your NeuroSpark experience</p>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900">Calendar Integration</h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>Connect your calendar to see your tasks alongside existing events.</p>
                        </div>
                        <div className="mt-5">
                            {calendarConnected ? (
                                <div className="flex items-center space-x-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Connected
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setCalendarConnected(false)}
                                        className="text-sm text-red-600 hover:text-red-900"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => setCalendarConnected(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Connect Google Calendar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCalendarConnected(true)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Connect Apple Calendar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>Manage your account preferences and data.</p>
                        </div>
                        <div className="mt-5">
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Export Your Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 