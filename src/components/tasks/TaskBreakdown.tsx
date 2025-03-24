import React, { useState } from 'react';
import { BreakdownResponse } from '@/types';
import { useAppStore } from '@/store';

interface TaskBreakdownProps {
    goalTitle: string;
    deadline?: Date;
    onComplete: () => void;
    goalId?: string;
}

export default function TaskBreakdown({ goalTitle, deadline, onComplete, goalId }: TaskBreakdownProps) {
    const { addTask } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [breakdownResult, setBreakdownResult] = useState<BreakdownResponse | null>(null);
    const [selectedTasks, setSelectedTasks] = useState<Record<string, boolean>>({});

    // Handle submitting the goal for breakdown
    const handleBreakdown = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/ai/breakdown', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    goal: goalTitle,
                    deadline: deadline?.toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to break down task');
            }

            const data = await response.json();
            setBreakdownResult(data);

            // Initialize all tasks as selected
            const initialSelectedState: Record<string, boolean> = {};
            data.tasks.forEach((task: { title: string }) => {
                initialSelectedState[task.title] = true;
            });
            setSelectedTasks(initialSelectedState);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Toggle selection of a task
    const toggleTaskSelection = (taskTitle: string) => {
        setSelectedTasks(prev => ({
            ...prev,
            [taskTitle]: !prev[taskTitle],
        }));
    };

    // Simple function to suggest a schedule for tasks (moved from server-side to client-side)
    const suggestSchedule = (tasks: BreakdownResponse['tasks']) => {
        const today = new Date();
        const endDate = deadline || new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // Default: 1 week

        const daysBetween = Math.max(1, Math.ceil((endDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)));

        // Calculate total estimated time
        const totalMinutes = tasks.reduce((sum, task) => sum + (task.estimatedMinutes || 30), 0);

        // Allocate minutes per day 
        const minutesPerDay = Math.ceil(totalMinutes / daysBetween);

        // Simple algorithm: distribute tasks evenly across days
        const schedule: { date: Date; tasks: string[] }[] = [];

        let currentDate = new Date(today);
        let currentDayMinutes = 0;
        let currentDayTasks: string[] = [];

        tasks.forEach(task => {
            const taskMinutes = task.estimatedMinutes || 30;

            // If adding this task would exceed the target minutes per day, move to next day
            if (currentDayMinutes + taskMinutes > minutesPerDay && currentDayTasks.length > 0) {
                schedule.push({
                    date: new Date(currentDate),
                    tasks: [...currentDayTasks],
                });

                currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
                currentDayMinutes = 0;
                currentDayTasks = [];
            }

            currentDayMinutes += taskMinutes;
            currentDayTasks.push(task.title);
        });

        // Add any remaining tasks
        if (currentDayTasks.length > 0) {
            schedule.push({
                date: new Date(currentDate),
                tasks: currentDayTasks,
            });
        }

        return schedule;
    };

    // Handle adding the selected tasks to the user's goal
    const handleAddTasks = (goalId: string) => {
        if (!breakdownResult) return;

        // Filter out unselected tasks
        const tasksToAdd = breakdownResult.tasks.filter(task =>
            selectedTasks[task.title]
        );

        // Get a suggested schedule for the tasks
        const schedule = suggestSchedule(tasksToAdd);

        // Add each task to the store
        tasksToAdd.forEach((task, index) => {
            // If we have a schedule suggestion, use that date
            const scheduledDate = schedule[index] ? schedule[index].date : new Date();

            // Create a start and end time based on the estimated minutes
            const startTime = new Date(scheduledDate);
            startTime.setHours(10 + index, 0, 0); // Starting at 10 AM, spacing tasks out

            const endTime = new Date(startTime);
            endTime.setMinutes(startTime.getMinutes() + (task.estimatedMinutes || 30));

            addTask(goalId, {
                title: task.title,
                description: task.description,
                status: 'todo',
                estimatedMinutes: task.estimatedMinutes,
                startTime,
                endTime,
                dueDate: deadline,
            });
        });

        onComplete();
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Break Down Your Goal
            </h2>

            {!breakdownResult && (
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Let's break "{goalTitle}" into smaller, manageable tasks that feel less overwhelming.
                    </p>

                    {deadline && (
                        <p className="text-sm text-indigo-600">
                            Due by: {deadline.toLocaleDateString()}
                        </p>
                    )}

                    <button
                        onClick={handleBreakdown}
                        disabled={loading}
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Breaking down...' : 'Break Down This Goal'}
                    </button>

                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                </div>
            )}

            {breakdownResult && (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800">
                            Step-by-Step Plan
                        </h3>

                        <ul className="space-y-3">
                            {breakdownResult.tasks.map((task, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 pt-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedTasks[task.title] || false}
                                            onChange={() => toggleTaskSelection(task.title)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                                        <p className="text-sm text-gray-500">{task.description}</p>
                                        {task.estimatedMinutes && (
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mt-1">
                                                ~{task.estimatedMinutes} min
                                            </span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {breakdownResult.suggestions && breakdownResult.suggestions.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                Helpful Tips
                            </h3>
                            <ul className="space-y-1 text-sm text-gray-600 list-disc pl-5">
                                {breakdownResult.suggestions.map((suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex justify-between pt-4 border-t border-gray-200">
                        <button
                            onClick={() => setBreakdownResult(null)}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            Start Over
                        </button>

                        <button
                            onClick={() => handleAddTasks(goalId || 'placeholder-goal-id')}
                            className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Add Tasks to My Plan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 