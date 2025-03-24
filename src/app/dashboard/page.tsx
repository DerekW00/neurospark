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
                    <h1 className="text-2xl font-semibold text-[var(--foreground)]">Dashboard</h1>
                    <span className="inline-flex items-center rounded-md bg-[var(--primary)] bg-opacity-10 px-2 py-1 text-xs font-medium text-[var(--primary)] ring-1 ring-inset ring-[var(--primary)] ring-opacity-20">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                </div>

                {/* Energy level indicator */}
                {todaysEnergy ? (
                    <div className={`p-4 rounded-lg border-l-4 ${todaysEnergy === 'low'
                        ? 'bg-[var(--low-energy)] border-[var(--danger)]'
                        : todaysEnergy === 'medium'
                            ? 'bg-[var(--medium-energy)] border-[var(--warning)]'
                            : 'bg-[var(--high-energy)] border-[var(--success)]'
                        }`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <span className="text-2xl">
                                    {todaysEnergy === 'low' ? '🥱' : todaysEnergy === 'medium' ? '🙂' : '😃'}
                                </span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-[var(--foreground)]">
                                    {todaysEnergy === 'low'
                                        ? 'Your energy is low today. Focus on one key task.'
                                        : todaysEnergy === 'medium'
                                            ? 'Your energy is steady today. Make progress on 2-3 tasks.'
                                            : 'Your energy is high today! Tackle challenging tasks now.'
                                    }
                                </p>
                                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                                    <Link href="/energy" className="font-medium underline">
                                        Update energy level
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link href="/energy" className="block p-4 bg-[var(--primary)] bg-opacity-10 rounded-lg border border-[var(--primary)] border-opacity-20 hover:bg-opacity-15 transition-colors">
                        <h3 className="font-medium text-[var(--primary)] flex items-center">
                            <span className="text-xl mr-2">⚡</span>
                            Log today's energy level
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">
                            Tracking your energy helps plan your day better
                        </p>
                    </Link>
                )}

                {/* Today's tasks */}
                <div className="bg-[var(--card)] rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-[var(--card-alt)] border-b border-[var(--border)] flex justify-between items-center">
                        <h2 className="font-medium text-[var(--foreground)]">Today's Tasks</h2>
                        <Link href="/tasks" className="text-xs text-[var(--primary)] hover:text-[var(--primary)] hover:underline">
                            View all
                        </Link>
                    </div>

                    {todaysTasks.length > 0 ? (
                        <ul className="divide-y divide-[var(--border)]">
                            {todaysTasks.map(task => (
                                <li key={task.id} className="p-4 flex items-start">
                                    <div className="flex-shrink-0 pt-0.5">
                                        <button className="h-5 w-5 rounded-full border border-[var(--border)] bg-[var(--card)] flex items-center justify-center">
                                            {task.status === 'completed' && (
                                                <CheckCircleIcon className="h-4 w-4 text-[var(--success)]" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-[var(--muted)] line-through' : 'text-[var(--foreground)]'}`}>
                                                {task.title}
                                            </p>
                                            {task.startTime && (
                                                <span className="text-xs text-[var(--muted-foreground)]">
                                                    {new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        {task.description && (
                                            <p className="mt-1 text-xs text-[var(--muted-foreground)]">{task.description}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-[var(--muted-foreground)]">No tasks scheduled for today</p>
                            <button
                                onClick={() => setShowNewGoalPrompt(true)}
                                className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-[var(--primary)] bg-[var(--primary)] bg-opacity-10 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Add Task
                            </button>
                        </div>
                    )}
                </div>

                {/* Goals progress */}
                <div className="bg-[var(--card)] rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-[var(--card-alt)] border-b border-[var(--border)] flex justify-between items-center">
                        <h2 className="font-medium text-[var(--foreground)]">Your Goals</h2>
                        <Link href="/tasks" className="text-xs text-[var(--primary)] hover:text-[var(--primary)] hover:underline">
                            Manage goals
                        </Link>
                    </div>

                    {goals.length > 0 ? (
                        <ul className="divide-y divide-[var(--border)]">
                            {goals.map(goal => {
                                // Calculate progress
                                const totalTasks = goal.tasks.length;
                                const completedTasks = goal.tasks.filter(t => t.status === 'completed').length;
                                const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                                return (
                                    <li key={goal.id} className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-[var(--foreground)]">{goal.title}</h3>
                                                {goal.dueDate && (
                                                    <p className="text-xs text-[var(--muted-foreground)] flex items-center mt-1">
                                                        <ClockIcon className="h-3 w-3 mr-1" />
                                                        Due {new Date(goal.dueDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${progressPercent === 100
                                                ? 'bg-[var(--success)] bg-opacity-20 text-[var(--success)]'
                                                : progressPercent > 50
                                                    ? 'bg-[var(--primary)] bg-opacity-20 text-[var(--primary)]'
                                                    : 'bg-[var(--card-alt)] text-[var(--muted-foreground)]'
                                                }`}>
                                                {progressPercent}% complete
                                            </span>
                                        </div>

                                        <div className="mt-2 w-full bg-[var(--card-alt)] rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${progressPercent === 100
                                                    ? 'bg-[var(--success)]'
                                                    : 'bg-[var(--primary)]'
                                                    }`}
                                                style={{ width: `${progressPercent}%` }}
                                            ></div>
                                        </div>

                                        <div className="mt-2 text-xs text-[var(--muted-foreground)]">
                                            {completedTasks} of {totalTasks} tasks completed
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-[var(--muted-foreground)]">No goals created yet</p>
                            <Link
                                href="/onboarding"
                                className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-[var(--primary)] bg-[var(--primary)] bg-opacity-10 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Create a Goal
                            </Link>
                        </div>
                    )}
                </div>

                {/* Upcoming section */}
                <div className="bg-[var(--card)] rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-[var(--card-alt)] border-b border-[var(--border)] flex justify-between items-center">
                        <h2 className="font-medium text-[var(--foreground)]">Coming Up</h2>
                        <Link href="/calendar" className="text-xs text-[var(--primary)] hover:text-[var(--primary)] hover:underline">
                            View calendar
                        </Link>
                    </div>

                    {upcomingTasks.length > 0 ? (
                        <ul className="divide-y divide-[var(--border)]">
                            {upcomingTasks.slice(0, 3).map(task => (
                                <li key={task.id} className="p-4 flex">
                                    <div className="flex-shrink-0 pt-0.5">
                                        <CalendarIcon className="h-5 w-5 text-[var(--muted)]" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-[var(--foreground)]">{task.title}</p>
                                        {task.startTime && (
                                            <p className="text-xs text-[var(--muted-foreground)]">
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
                            <p className="text-[var(--muted-foreground)]">No upcoming tasks in the next 7 days</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 