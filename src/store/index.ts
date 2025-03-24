import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Goal, Task, CheckIn, EnergyLog, CalendarEvent } from '../types';

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
    addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateGoal: (goalId: string, updates: Partial<Omit<Goal, 'id' | 'tasks'>>) => void;
    deleteGoal: (goalId: string) => void;
    setCurrentGoal: (goalId: string) => void;

    addTask: (goalId: string, task: Omit<Task, 'id' | 'goalId' | 'createdAt' | 'updatedAt'>) => void;
    updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'goalId'>>) => void;
    deleteTask: (taskId: string) => void;
    completeTask: (taskId: string) => void;

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
            calendarEvents: [],
            calendarConnected: false,
            checkIns: [],
            energyLogs: [],
            todaysEnergy: undefined,
            isOnboarding: true,
            sidebarOpen: true,

            // User actions
            setUser: (userData) => set((state) => ({
                user: {
                    ...state.user,
                    ...userData,
                    isLoggedIn: true,
                },
            })),

            logout: () => set({
                user: { isLoggedIn: false },
                currentGoal: undefined,
            }),

            // Goal/Task actions
            addGoal: (goal) => set((state) => ({
                goals: [
                    ...state.goals,
                    {
                        ...goal,
                        id: generateId(),
                        tasks: [],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
            })),

            updateGoal: (goalId, updates) => set((state) => ({
                goals: state.goals.map((goal) =>
                    goal.id === goalId
                        ? { ...goal, ...updates, updatedAt: new Date() }
                        : goal
                ),
            })),

            deleteGoal: (goalId) => set((state) => ({
                goals: state.goals.filter((goal) => goal.id !== goalId),
                currentGoal: state.currentGoal?.id === goalId ? undefined : state.currentGoal,
            })),

            setCurrentGoal: (goalId) => set((state) => ({
                currentGoal: state.goals.find((goal) => goal.id === goalId),
            })),

            addTask: (goalId, task) => set((state) => {
                const newTask = {
                    ...task,
                    id: generateId(),
                    goalId,
                    status: 'todo' as const,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                return {
                    goals: state.goals.map((goal) =>
                        goal.id === goalId
                            ? { ...goal, tasks: [...goal.tasks, newTask] }
                            : goal
                    ),
                    currentGoal: state.currentGoal?.id === goalId
                        ? { ...state.currentGoal, tasks: [...state.currentGoal.tasks, newTask] }
                        : state.currentGoal,
                };
            }),

            updateTask: (taskId, updates) => set((state) => {
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
            }),

            deleteTask: (taskId) => set((state) => {
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
            }),

            completeTask: (taskId) => get().updateTask(taskId, { status: 'completed' }),

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