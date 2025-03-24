import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useAppStore } from '@/store';
import { Task, CalendarEvent } from '@/types';
import { fetchCalendarEvents } from '@/services/calendar/google';
import 'react-calendar/dist/Calendar.css';

interface CalendarViewProps {
    onSelectTask?: (task: Task) => void;
}

export default function CalendarView({ onSelectTask }: CalendarViewProps) {
    const { goals, calendarEvents, addCalendarEvent } = useAppStore();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

    // All tasks from all goals
    const allTasks = goals.flatMap(goal => goal.tasks);

    // Get tasks for the selected date
    const getTasksForDate = (date: Date) => {
        // Clone date and set to start of day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        // Clone date and set to end of day
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return allTasks.filter(task => {
            if (!task.startTime) return false;

            const taskDate = task.startTime instanceof Date ? task.startTime : new Date(task.startTime);
            return taskDate >= startOfDay && taskDate <= endOfDay;
        });
    };

    // Get all events for the selected date (both tasks and external calendar events)
    const getEventsForDate = (date: Date) => {
        // Clone date and set to start of day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        // Clone date and set to end of day
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return calendarEvents.filter(event => {
            const eventDate = event.start instanceof Date ? event.start : new Date(event.start);
            return eventDate >= startOfDay && eventDate <= endOfDay;
        });
    };

    // Fetch calendar events when the selected date changes
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);

                // Create start and end dates for the fetch (either a day or a week)
                const startDate = new Date(selectedDate);
                startDate.setHours(0, 0, 0, 0);

                const endDate = new Date(selectedDate);
                if (viewMode === 'week') {
                    // Add 6 days to include the full week
                    endDate.setDate(endDate.getDate() + 6);
                }
                endDate.setHours(23, 59, 59, 999);

                const events = await fetchCalendarEvents(startDate, endDate);

                // Add fetched events to the store if they don't already exist
                events.forEach(event => {
                    const exists = calendarEvents.some(e =>
                        e.externalEventId === event.externalEventId
                    );

                    if (!exists) {
                        addCalendarEvent(event);
                    }
                });
            } catch (error) {
                console.error('Error fetching calendar events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [selectedDate, viewMode, addCalendarEvent, calendarEvents]);

    // Handle date change in the calendar
    const handleDateChange = (date: Date | Date[]) => {
        if (Array.isArray(date)) {
            setSelectedDate(date[0]);
        } else {
            setSelectedDate(date);
        }
    };

    // Calculate hour slots for the day view
    const hourSlots = Array.from({ length: 24 }, (_, i) => i);

    // Format a date for display
    const formatTime = (date: Date | string) => {
        // Make sure we have a Date object
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Check if a task is happening at a specific hour
    const isTaskInHour = (task: Task, hour: number) => {
        if (!task.startTime || !task.endTime) return false;

        const taskStart = task.startTime instanceof Date ? task.startTime : new Date(task.startTime);
        const taskEnd = task.endTime instanceof Date ? task.endTime : new Date(task.endTime);

        const hourStart = new Date(selectedDate);
        hourStart.setHours(hour, 0, 0, 0);

        const hourEnd = new Date(selectedDate);
        hourEnd.setHours(hour, 59, 59, 999);

        return (
            (taskStart >= hourStart && taskStart <= hourEnd) ||
            (taskEnd >= hourStart && taskEnd <= hourEnd) ||
            (taskStart <= hourStart && taskEnd >= hourEnd)
        );
    };

    // Check if a calendar event is happening at a specific hour
    const isEventInHour = (event: CalendarEvent, hour: number) => {
        const eventStart = event.start instanceof Date ? event.start : new Date(event.start);
        const eventEnd = event.end instanceof Date ? event.end : new Date(event.end);

        const hourStart = new Date(selectedDate);
        hourStart.setHours(hour, 0, 0, 0);

        const hourEnd = new Date(selectedDate);
        hourEnd.setHours(hour, 59, 59, 999);

        return (
            (eventStart >= hourStart && eventStart <= hourEnd) ||
            (eventEnd >= hourStart && eventEnd <= hourEnd) ||
            (eventStart <= hourStart && eventEnd >= hourEnd)
        );
    };

    // Render the day view
    const renderDayView = () => {
        const tasksForDay = getTasksForDate(selectedDate);
        const eventsForDay = getEventsForDate(selectedDate);

        return (
            <div className="mt-4 bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">
                        {selectedDate.toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h3>
                </div>

                <div className="divide-y divide-gray-200">
                    {hourSlots.map(hour => {
                        const tasksInHour = tasksForDay.filter(task => isTaskInHour(task, hour));
                        const eventsInHour = eventsForDay.filter(event => isEventInHour(event, hour));

                        if (hour < 6 || hour > 22) {
                            // Skip displaying very early or late hours if empty
                            if (tasksInHour.length === 0 && eventsInHour.length === 0) {
                                return null;
                            }
                        }

                        return (
                            <div key={hour} className="flex min-h-[60px]">
                                <div className="w-16 py-2 text-center text-sm text-gray-500 bg-gray-50 flex-shrink-0">
                                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                                </div>

                                <div className="flex-1 p-2 space-y-1">
                                    {tasksInHour.map(task => (
                                        <div
                                            key={task.id}
                                            className="p-2 rounded bg-indigo-100 border-l-4 border-indigo-500 cursor-pointer"
                                            onClick={() => onSelectTask && onSelectTask(task)}
                                        >
                                            <div className="font-medium text-indigo-800">{task.title}</div>
                                            {task.startTime && task.endTime && (
                                                <div className="text-xs text-indigo-600">
                                                    {formatTime(task.startTime)} - {formatTime(task.endTime)}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {eventsInHour.map(event => (
                                        <div
                                            key={event.id}
                                            className="p-2 rounded bg-blue-50 border-l-4 border-blue-300"
                                        >
                                            <div className="font-medium text-blue-800">{event.title}</div>
                                            <div className="text-xs text-blue-600">
                                                {formatTime(event.start)} - {formatTime(event.end)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Calendar</h2>

                <div className="flex space-x-2">
                    <button
                        onClick={() => setViewMode('day')}
                        className={`px-3 py-1 rounded-md text-sm ${viewMode === 'day'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Day
                    </button>
                    <button
                        onClick={() => setViewMode('week')}
                        className={`px-3 py-1 rounded-md text-sm ${viewMode === 'week'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Week
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow p-4">
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            className="w-full border-0"
                        />

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-indigo-100 border-l-4 border-indigo-500 mr-2"></div>
                                <span className="text-sm text-gray-600">Your Tasks</span>
                            </div>

                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-blue-50 border-l-4 border-blue-300 mr-2"></div>
                                <span className="text-sm text-gray-600">External Events</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-5">
                    {loading ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-500">Loading calendar data...</p>
                        </div>
                    ) : (
                        renderDayView()
                    )}
                </div>
            </div>
        </div>
    );
} 