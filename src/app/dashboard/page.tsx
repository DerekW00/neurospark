'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { CheckCircleIcon, ClockIcon, CalendarIcon, PlusIcon } from '@heroicons/react/24/outline';
import { scheduleCheckIns } from '@/services/notification';

export default function DashboardPage() {
    const {
        goals,
        todaysEnergy,
        checkIns,
        addCheckIn,
        calendarEvents
    } = useAppStore();

    const [showNewGoalPrompt, setShowNewGoalPrompt] = useState(false);

    // Get today's tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all tasks across all goals
    const allTasks = goals.flatMap(goal => goal.tasks);

    // Filter for today's tasks based on startTime
    const todaysTasks = allTasks.filter(task => {
        if (!task.startTime) return false;
        const taskDate = new Date(task.startTime);
        return taskDate >= today && taskDate <= endOfDay;
    });

    // Upcoming tasks (next 7 days excluding today)
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingTasks = allTasks.filter(task => {
        if (!task.startTime) return false;
        const taskDate = new Date(task.startTime);
        return taskDate > endOfDay && taskDate <= nextWeek;
    });

    // Generate check-ins if we don't have any for today
    useEffect(() => {
        const todaysCheckIns = checkIns.filter(checkIn => {
            const checkInDate = new Date(checkIn.scheduledFor);
            return checkInDate >= today && checkInDate <= endOfDay;
        });

        if (todaysCheckIns.length === 0) {
            // Schedule new check-ins for today
            const newCheckIns = scheduleCheckIns(new Date());
            newCheckIns.forEach(checkIn => {
                addCheckIn(checkIn);
            });
        }
    }, [checkIns, addCheckIn]);

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                </div>

                {/* Energy level indicator */}
                {todaysEnergy ? (
                    <div className={`p-4 rounded-lg border-l-4 ${todaysEnergy === 'low'
                        ? 'bg-red-50 border-red-400 text-red-700'
                        : todaysEnergy === 'medium'
                            ? 'bg-yellow-50 border-yellow-400 text-yellow-700'
                            : 'bg-green-50 border-green-400 text-green-700'
                        }`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <span className="text-2xl">
                                    {todaysEnergy === 'low' ? '🥱' : todaysEnergy === 'medium' ? '🙂' : '😃'}
                                </span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">
                                    {todaysEnergy === 'low'
                                        ? 'Your energy is low today. Focus on one key task.'
                                        : todaysEnergy === 'medium'
                                            ? 'Your energy is steady today. Make progress on 2-3 tasks.'
                                            : 'Your energy is high today! Tackle challenging tasks now.'
                                    }
                                </p>
                                <p className="mt-1 text-xs">
                                    <Link href="/energy" className="font-medium underline">
                                        Update energy level
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link href="/energy" className="block p-4 bg-indigo-50 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors">
                        <h3 className="font-medium text-indigo-800 flex items-center">
                            <span className="text-xl mr-2">⚡</span>
                            Log today's energy level
                        </h3>
                        <p className="text-sm text-indigo-600 mt-1">
                            Tracking your energy helps plan your day better
                        </p>
                    </Link>
                )}

                {/* Today's tasks */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-medium text-gray-800">Today's Tasks</h2>
                        <Link href="/tasks" className="text-xs text-indigo-600 hover:text-indigo-800">
                            View all
                        </Link>
                    </div>

                    {todaysTasks.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {todaysTasks.map(task => (
                                <li key={task.id} className="p-4 flex items-start">
                                    <div className="flex-shrink-0 pt-0.5">
                                        <button className="h-5 w-5 rounded-full border border-gray-300 bg-white flex items-center justify-center">
                                            {task.status === 'completed' && (
                                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                                {task.title}
                                            </p>
                                            {task.startTime && (
                                                <span className="text-xs text-gray-500">
                                                    {new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        {task.description && (
                                            <p className="mt-1 text-xs text-gray-500">{task.description}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">No tasks scheduled for today</p>
                            <button
                                onClick={() => setShowNewGoalPrompt(true)}
                                className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Add Task
                            </button>
                        </div>
                    )}
                </div>

                {/* Goals progress */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-medium text-gray-800">Your Goals</h2>
                        <Link href="/tasks" className="text-xs text-indigo-600 hover:text-indigo-800">
                            Manage goals
                        </Link>
                    </div>

                    {goals.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {goals.map(goal => {
                                // Calculate progress
                                const totalTasks = goal.tasks.length;
                                const completedTasks = goal.tasks.filter(t => t.status === 'completed').length;
                                const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                                return (
                                    <li key={goal.id} className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-800">{goal.title}</h3>
                                                {goal.dueDate && (
                                                    <p className="text-xs text-gray-500 flex items-center mt-1">
                                                        <ClockIcon className="h-3 w-3 mr-1" />
                                                        Due {new Date(goal.dueDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${progressPercent === 100
                                                ? 'bg-green-100 text-green-800'
                                                : progressPercent > 50
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {progressPercent}% complete
                                            </span>
                                        </div>

                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${progressPercent === 100
                                                    ? 'bg-green-500'
                                                    : 'bg-indigo-500'
                                                    }`}
                                                style={{ width: `${progressPercent}%` }}
                                            ></div>
                                        </div>

                                        <div className="mt-2 text-xs text-gray-500">
                                            {completedTasks} of {totalTasks} tasks completed
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">No goals created yet</p>
                            <Link
                                href="/onboarding"
                                className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Create a Goal
                            </Link>
                        </div>
                    )}
                </div>

                {/* Upcoming section */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-medium text-gray-800">Coming Up</h2>
                        <Link href="/calendar" className="text-xs text-indigo-600 hover:text-indigo-800">
                            View calendar
                        </Link>
                    </div>

                    {upcomingTasks.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {upcomingTasks.slice(0, 3).map(task => (
                                <li key={task.id} className="p-4 flex">
                                    <div className="flex-shrink-0 pt-0.5">
                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-800">{task.title}</p>
                                        {task.startTime && (
                                            <p className="text-xs text-gray-500">
                                                {new Date(task.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                {' at '}
                                                {new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">No upcoming tasks in the next 7 days</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 