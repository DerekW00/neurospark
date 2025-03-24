'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import EnergyLog from '@/components/energy/EnergyLog';
import { useAppStore } from '@/store';

export default function EnergyPage() {
    const { energyLogs } = useAppStore();

    // Group logs by month for display
    const groupedLogs: Record<string, typeof energyLogs> = {};

    energyLogs.forEach(log => {
        const date = new Date(log.date);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

        if (!groupedLogs[monthYear]) {
            groupedLogs[monthYear] = [];
        }

        groupedLogs[monthYear].push(log);
    });

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Energy Tracking</h1>
                </div>

                <p className="text-gray-600">
                    Track your energy levels to help plan your tasks effectively. On low energy days, focus on just one key task.
                    Schedule challenging tasks for high energy days.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <EnergyLog />

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Your Energy History
                        </h2>

                        {Object.keys(groupedLogs).length > 0 ? (
                            <div className="space-y-6">
                                {Object.entries(groupedLogs).map(([monthYear, logs]) => (
                                    <div key={monthYear}>
                                        <h3 className="text-md font-medium text-gray-700 mb-2">{monthYear}</h3>

                                        <div className="space-y-2">
                                            {logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => (
                                                <div key={log.id} className="flex items-center p-2 rounded-md bg-gray-50">
                                                    <div className={`w-2 h-full mr-2 rounded-full ${log.level === 'low'
                                                            ? 'bg-red-400'
                                                            : log.level === 'medium'
                                                                ? 'bg-yellow-400'
                                                                : 'bg-green-400'
                                                        }`}></div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <span className="text-lg mr-2">
                                                                {log.level === 'low' ? '🥱' : log.level === 'medium' ? '🙂' : '😃'}
                                                            </span>
                                                            <span className="font-medium capitalize">{log.level}</span>
                                                        </div>

                                                        {log.notes && (
                                                            <p className="text-xs text-gray-500 mt-1">{log.notes}</p>
                                                        )}
                                                    </div>

                                                    <div className="text-xs text-gray-500">
                                                        {new Date(log.date).toLocaleDateString(undefined, {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No energy logs yet</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Start tracking your energy today to see patterns over time
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 