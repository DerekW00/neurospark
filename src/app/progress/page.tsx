'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAppStore } from '@/store';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function ProgressPage() {
    const { goals } = useAppStore();

    // Calculate overall progress across all goals
    const totalTasks = goals.reduce((sum, goal) => sum + goal.tasks.length, 0);
    const completedTasks = goals.reduce(
        (sum, goal) => sum + goal.tasks.filter(t => t.status === 'completed').length,
        0
    );
    const overallProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Progress Tracker</h1>
                </div>

                {goals.length > 0 ? (
                    <>
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Overall Progress</h2>

                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500">
                                    {completedTasks} of {totalTasks} tasks completed
                                </span>
                                <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${overallProgressPercent === 100
                                        ? 'bg-green-100 text-green-800'
                                        : overallProgressPercent > 50
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {overallProgressPercent}% complete
                                </span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full ${overallProgressPercent === 100
                                            ? 'bg-green-500'
                                            : 'bg-indigo-500'
                                        }`}
                                    style={{ width: `${overallProgressPercent}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h2 className="text-lg font-medium text-gray-900">Goal-by-Goal Progress</h2>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Track how you're doing on each individual goal
                                </p>
                            </div>

                            <ul className="divide-y divide-gray-200">
                                {goals.map(goal => {
                                    // Calculate progress for this goal
                                    const goalTotalTasks = goal.tasks.length;
                                    const goalCompletedTasks = goal.tasks.filter(t => t.status === 'completed').length;
                                    const progressPercent = goalTotalTasks > 0
                                        ? Math.round((goalCompletedTasks / goalTotalTasks) * 100)
                                        : 0;

                                    return (
                                        <li key={goal.id} className="px-6 py-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                                                    {goal.dueDate && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Due {new Date(goal.dueDate).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${progressPercent === 100
                                                        ? 'bg-green-100 text-green-800'
                                                        : progressPercent > 50
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {progressPercent}% complete
                                                </span>
                                            </div>

                                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                                <div
                                                    className={`h-2 rounded-full ${progressPercent === 100
                                                            ? 'bg-green-500'
                                                            : 'bg-indigo-500'
                                                        }`}
                                                    style={{ width: `${progressPercent}%` }}
                                                ></div>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-xs text-gray-500">
                                                    {goalCompletedTasks} of {goalTotalTasks} tasks completed
                                                </span>
                                                <Link href={`/tasks?goalId=${goal.id}`} className="text-xs text-indigo-600 hover:text-indigo-900">
                                                    View Tasks
                                                </Link>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
                        <p className="text-gray-500 mb-4">
                            Get started by creating your first goal to track your progress.
                        </p>
                        <Link
                            href="/onboarding"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Create Your First Goal
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
} 