'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAppStore } from '@/store';
import Link from 'next/link';
import { PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function TasksPage() {
    const { goals, completeTask } = useAppStore();
    const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});

    // Toggle expanded state for a goal
    const toggleGoalExpanded = (goalId: string) => {
        setExpandedGoals(prev => ({
            ...prev,
            [goalId]: !prev[goalId]
        }));
    };

    // Mark a task as complete
    const handleCompleteTask = (taskId: string) => {
        completeTask(taskId);
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
                    <Link
                        href="/onboarding"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        New Goal
                    </Link>
                </div>

                <div className="space-y-4">
                    {goals.length > 0 ? (
                        goals.map(goal => {
                            const isExpanded = expandedGoals[goal.id] ?? true;
                            const pendingTasks = goal.tasks.filter(task => task.status !== 'completed');
                            const completedTasks = goal.tasks.filter(task => task.status === 'completed');

                            return (
                                <div key={goal.id} className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                        <button
                                            onClick={() => toggleGoalExpanded(goal.id)}
                                            className="w-full flex items-center justify-between"
                                        >
                                            <h2 className="font-medium text-gray-800">{goal.title}</h2>
                                            <div className="flex items-center space-x-2 text-gray-500">
                                                <span className="text-sm">{pendingTasks.length} pending</span>
                                                {isExpanded ? (
                                                    <ChevronUpIcon className="h-5 w-5" />
                                                ) : (
                                                    <ChevronDownIcon className="h-5 w-5" />
                                                )}
                                            </div>
                                        </button>
                                    </div>

                                    {isExpanded && (
                                        <div className="divide-y divide-gray-200">
                                            {pendingTasks.length > 0 ? (
                                                <ul className="divide-y divide-gray-200">
                                                    {pendingTasks.map(task => (
                                                        <li key={task.id} className="p-4 flex items-start">
                                                            <div className="flex-shrink-0 pt-0.5">
                                                                <button
                                                                    onClick={() => handleCompleteTask(task.id)}
                                                                    className="h-5 w-5 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50"
                                                                >
                                                                </button>
                                                            </div>
                                                            <div className="ml-3 flex-1">
                                                                <div className="flex items-center justify-between">
                                                                    <p className="text-sm font-medium text-gray-800">
                                                                        {task.title}
                                                                    </p>
                                                                    {task.startTime && (
                                                                        <span className="text-xs text-gray-500">
                                                                            {new Date(task.startTime).toLocaleDateString()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {task.description && (
                                                                    <p className="mt-1 text-xs text-gray-500">{task.description}</p>
                                                                )}
                                                                {task.estimatedMinutes && (
                                                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mt-1">
                                                                        ~{task.estimatedMinutes} min
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="p-4 text-center text-gray-500">
                                                    All tasks completed for this goal!
                                                </div>
                                            )}

                                            {completedTasks.length > 0 && (
                                                <div className="p-4">
                                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Completed</h3>
                                                    <ul className="space-y-2">
                                                        {completedTasks.map(task => (
                                                            <li key={task.id} className="flex items-start opacity-60">
                                                                <div className="flex-shrink-0 pt-0.5">
                                                                    <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                                                                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                                                                            <path d="M3.72 5.15a.75.75 0 0 1 1.06-1.06L6 5.31l2.22-2.22a.75.75 0 1 1 1.06 1.06L7.06 6.37l2.22 2.22a.75.75 0 1 1-1.06 1.06L6 7.43 3.78 9.65a.75.75 0 0 1-1.06-1.06L4.94 6.37 2.72 4.15z" />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-3">
                                                                    <p className="text-sm text-gray-400 line-through">
                                                                        {task.title}
                                                                    </p>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
                            <p className="text-gray-500 mb-4">
                                Get started by creating your first goal. We'll help you break it down into manageable tasks.
                            </p>
                            <Link
                                href="/onboarding"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Your First Goal
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 