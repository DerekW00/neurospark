import React, { useState } from 'react';
import { useAppStore } from '@/store';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface NewTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewTaskModal({ isOpen, onClose }: NewTaskModalProps) {
    const { goals, addTask } = useAppStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedGoalId, setSelectedGoalId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('30');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const activeGoals = goals.filter(goal => goal.status === 'active');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Please enter a task title');
            return;
        }

        if (!selectedGoalId) {
            setError('Please select a goal for this task');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Calculate start and end times
            let taskStartTime: Date | undefined;
            let taskEndTime: Date | undefined;

            if (startDate && startTime) {
                taskStartTime = new Date(`${startDate}T${startTime}`);

                // Calculate end time based on duration
                taskEndTime = new Date(taskStartTime);
                taskEndTime.setMinutes(taskEndTime.getMinutes() + parseInt(duration, 10));
            }

            await addTask(selectedGoalId, {
                title,
                description,
                status: 'todo',
                startTime: taskStartTime,
                endTime: taskEndTime,
                estimatedMinutes: parseInt(duration, 10),
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Reset form and close modal
            setTitle('');
            setDescription('');
            setStartDate('');
            setStartTime('');
            setDuration('30');
            onClose();
        } catch (err) {
            console.error('Failed to add task:', err);
            setError('Failed to add task. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[var(--card)] rounded-lg shadow-lg w-full max-w-md m-4 max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-[var(--border)]">
                    <h2 className="text-lg font-medium text-[var(--foreground)]">Add New Task</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {error && (
                        <div className="p-3 bg-[var(--danger)] bg-opacity-10 text-[var(--danger)] text-sm rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                            Task Name*
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--card-alt)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            placeholder="E.g., Write email to team"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                            Related Goal*
                        </label>
                        <select
                            id="goal"
                            value={selectedGoalId}
                            onChange={(e) => setSelectedGoalId(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--card-alt)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                            <option value="">Select a goal</option>
                            {activeGoals.map(goal => (
                                <option key={goal.id} value={goal.id}>{goal.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 h-24 rounded-md border border-[var(--border)] bg-[var(--card-alt)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            placeholder="Any details about this task"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                Date (Optional)
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--card-alt)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>

                        <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                Time (Optional)
                            </label>
                            <input
                                type="time"
                                id="startTime"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--card-alt)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                            Estimated Duration (minutes)
                        </label>
                        <input
                            type="number"
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            min="5"
                            max="240"
                            step="5"
                            className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--card-alt)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center min-w-[80px]"
                            disabled={isLoading}
                        >
                            {isLoading ? <LoadingSpinner size="small" text="" /> : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 