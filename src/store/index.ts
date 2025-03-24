'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Goal, Task, CheckIn, EnergyLog, CalendarEvent } from '../types';
import {
    getUserGoals,
    createGoal as createFirestoreGoal,
    updateGoal as updateFirestoreGoal,
    deleteGoal as deleteFirestoreGoal,
    addTask as addFirestoreTask,
    updateTask as updateFirestoreTask,
    deleteTask as deleteFirestoreTask,
    completeTask as completeFirestoreTask
} from '@/services/firestore/goals';

interface AppState {
    // User state
    user: {
        isLoggedIn: boolean;
        id?: string;
        name?: string;
        email?: string;
        image?: string;
    };

    // Goals and tasks
    goals: Goal[];
    currentGoal?: Goal;
    isLoading: boolean;

    // Calendar
    calendarEvents: CalendarEvent[];
    calendarConnected: boolean;

    // Check-ins
    checkIns: CheckIn[];

    // Energy tracking
    energyLogs: EnergyLog[];
    todaysEnergy?: 'low' | 'medium' | 'high';

    // UI state
    isOnboarding: boolean;
    sidebarOpen: boolean;

    // Actions
    setUser: (user: Partial<AppState['user']>) => void;
    logout: () => void;

    // Goal/Task actions
    loadGoals: () => Promise<void>;
    addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
    updateGoal: (goalId: string, updates: Partial<Omit<Goal, 'id' | 'tasks'>>) => Promise<void>;
    deleteGoal: (goalId: string) => Promise<void>;
    setCurrentGoal: (goalId: string) => void;

    addTask: (goalId: string, task: Omit<Task, 'id' | 'goalId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
    updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'goalId'>>) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    completeTask: (taskId: string) => Promise<void>;

    // Calendar actions
    setCalendarConnected: (connected: boolean) => void;
    addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
    updateCalendarEvent: (eventId: string, updates: Partial<Omit<CalendarEvent, 'id'>>) => void;
    deleteCalendarEvent: (eventId: string) => void;

    // Check-in actions
    addCheckIn: (checkIn: Omit<CheckIn, 'id'>) => void;
    completeCheckIn: (checkInId: string) => void;
    skipCheckIn: (checkInId: string) => void;

    // Energy tracking actions
    logEnergy: (level: 'low' | 'medium' | 'high', notes?: string) => void;

    // UI actions
    toggleSidebar: () => void;
    completeOnboarding: () => void;
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Create store with persistence
export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: {
                isLoggedIn: false,
            },
            goals: [],
            currentGoal: undefined,
            isLoading: false,
            calendarEvents: [],
            calendarConnected: false,
            checkIns: [],
            energyLogs: [],
            todaysEnergy: undefined,
            isOnboarding: true,
            sidebarOpen: true,

            // User actions
            setUser: (userData) => {
                set((state) => ({
                    user: {
                        ...state.user,
                        ...userData,
                        isLoggedIn: true,
                    },
                }));

                // Load goals for the user
                if (userData.id) {
                    get().loadGoals();
                }
            },

            logout: () => set({
                user: { isLoggedIn: false },
                currentGoal: undefined,
                goals: [],
            }),

            // Goal/Task actions with Firestore integration
            loadGoals: async () => {
                const { user } = get();
                if (!user.id) return;

                set({ isLoading: true });
                try {
                    const goals = await getUserGoals(user.id);
                    set({ goals, isLoading: false });
                } catch (error) {
                    console.error('Failed to load goals:', error);
                    set({ isLoading: false });
                }
            },

            addGoal: async (goal) => {
                const { user } = get();
                if (!user.id) throw new Error('User must be logged in to add a goal');

                try {
                    // First add to Firestore
                    const goalId = await createFirestoreGoal(user.id, goal);

                    // Then update local state
                    set((state) => ({
                        goals: [
                            ...state.goals,
                            {
                                ...goal,
                                id: goalId,
                                tasks: [],
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        ],
                    }));

                    return goalId;
                } catch (error) {
                    console.error('Failed to add goal:', error);
                    throw error;
                }
            },

            updateGoal: async (goalId, updates) => {
                try {
                    // First update in Firestore
                    await updateFirestoreGoal(goalId, updates);

                    // Then update local state
                    set((state) => ({
                        goals: state.goals.map((goal) =>
                            goal.id === goalId
                                ? { ...goal, ...updates, updatedAt: new Date() }
                                : goal
                        ),
                    }));
                } catch (error) {
                    console.error('Failed to update goal:', error);
                    throw error;
                }
            },

            deleteGoal: async (goalId) => {
                try {
                    // First delete from Firestore
                    await deleteFirestoreGoal(goalId);

                    // Then update local state
                    set((state) => ({
                        goals: state.goals.filter((goal) => goal.id !== goalId),
                        currentGoal: state.currentGoal?.id === goalId ? undefined : state.currentGoal,
                    }));
                } catch (error) {
                    console.error('Failed to delete goal:', error);
                    throw error;
                }
            },

            setCurrentGoal: (goalId) => set((state) => ({
                currentGoal: state.goals.find((goal) => goal.id === goalId),
            })),

            addTask: async (goalId, task) => {
                try {
                    // First add to Firestore
                    const taskId = await addFirestoreTask(goalId, task);

                    const newTask = {
                        ...task,
                        id: taskId,
                        goalId,
                        status: 'todo' as const,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    // Then update local state
                    set((state) => ({
                        goals: state.goals.map((goal) =>
                            goal.id === goalId
                                ? { ...goal, tasks: [...goal.tasks, newTask] }
                                : goal
                        ),
                        currentGoal: state.currentGoal?.id === goalId
                            ? { ...state.currentGoal, tasks: [...state.currentGoal.tasks, newTask] }
                            : state.currentGoal,
                    }));

                    return taskId;
                } catch (error) {
                    console.error('Failed to add task:', error);
                    throw error;
                }
            },

            updateTask: async (taskId, updates) => {
                try {
                    // First update in Firestore
                    await updateFirestoreTask(taskId, updates);

                    // Then update local state
                    set((state) => {
                        const updatedGoals = state.goals.map((goal) => ({
                            ...goal,
                            tasks: goal.tasks.map((task) =>
                                task.id === taskId
                                    ? { ...task, ...updates, updatedAt: new Date() }
                                    : task
                            ),
                        }));

                        return {
                            goals: updatedGoals,
                            currentGoal: state.currentGoal
                                ? updatedGoals.find((goal) => goal.id === state.currentGoal?.id)
                                : undefined,
                        };
                    });
                } catch (error) {
                    console.error('Failed to update task:', error);
                    throw error;
                }
            },

            deleteTask: async (taskId) => {
                try {
                    // First delete from Firestore
                    await deleteFirestoreTask(taskId);

                    // Then update local state
                    set((state) => {
                        const updatedGoals = state.goals.map((goal) => ({
                            ...goal,
                            tasks: goal.tasks.filter((task) => task.id !== taskId),
                        }));

                        return {
                            goals: updatedGoals,
                            currentGoal: state.currentGoal
                                ? updatedGoals.find((goal) => goal.id === state.currentGoal?.id)
                                : undefined,
                        };
                    });
                } catch (error) {
                    console.error('Failed to delete task:', error);
                    throw error;
                }
            },

            completeTask: async (taskId) => {
                try {
                    // First complete in Firestore
                    await completeFirestoreTask(taskId);

                    // Then update local state using the updateTask method
                    await get().updateTask(taskId, { status: 'completed' });
                } catch (error) {
                    console.error('Failed to complete task:', error);
                    throw error;
                }
            },

            // Calendar actions
            setCalendarConnected: (connected) => set({ calendarConnected: connected }),

            addCalendarEvent: (event) => set((state) => ({
                calendarEvents: [...state.calendarEvents, { ...event, id: generateId() }],
            })),

            updateCalendarEvent: (eventId, updates) => set((state) => ({
                calendarEvents: state.calendarEvents.map((event) =>
                    event.id === eventId ? { ...event, ...updates } : event
                ),
            })),

            deleteCalendarEvent: (eventId) => set((state) => ({
                calendarEvents: state.calendarEvents.filter((event) => event.id !== eventId),
            })),

            // Check-in actions
            addCheckIn: (checkIn) => set((state) => ({
                checkIns: [...state.checkIns, { ...checkIn, id: generateId() }],
            })),

            completeCheckIn: (checkInId) => set((state) => ({
                checkIns: state.checkIns.map((checkIn) =>
                    checkIn.id === checkInId
                        ? { ...checkIn, status: 'completed', completedAt: new Date() }
                        : checkIn
                ),
            })),

            skipCheckIn: (checkInId) => set((state) => ({
                checkIns: state.checkIns.map((checkIn) =>
                    checkIn.id === checkInId
                        ? { ...checkIn, status: 'skipped' }
                        : checkIn
                ),
            })),

            // Energy tracking actions
            logEnergy: (level, notes) => set((state) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Filter out any previous logs from today
                const filteredLogs = state.energyLogs.filter((log) => {
                    const logDate = new Date(log.date);
                    logDate.setHours(0, 0, 0, 0);
                    return logDate.getTime() !== today.getTime();
                });

                return {
                    energyLogs: [
                        ...filteredLogs,
                        {
                            id: generateId(),
                            level,
                            notes: notes || '',
                            date: new Date(),
                        },
                    ],
                    todaysEnergy: level,
                };
            }),

            // UI actions
            toggleSidebar: () => set((state) => ({
                sidebarOpen: !state.sidebarOpen,
            })),

            completeOnboarding: () => set({ isOnboarding: false }),
        }),
        {
            name: 'neurospark-storage',
        }
    )
); 