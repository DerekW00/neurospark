// User types
export interface User {
    id: string;
    name?: string;
    email: string;
    image?: string;
}

// Task types
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'completed';
    goalId: string;
    dueDate?: Date;
    startTime?: Date;
    endTime?: Date;
    estimatedMinutes?: number;
    createdAt: Date;
    updatedAt: Date;
}

// Goal types
export interface Goal {
    id: string;
    title: string;
    description?: string;
    dueDate?: Date;
    status: 'active' | 'completed' | 'archived';
    tasks: Task[];
    createdAt: Date;
    updatedAt: Date;
}

// Check-in types
export interface CheckIn {
    id: string;
    type: 'morning' | 'midday' | 'evening' | 'task-specific';
    status: 'pending' | 'completed' | 'skipped';
    message: string;
    taskId?: string;
    scheduledFor: Date;
    completedAt?: Date;
}

// Energy/Mood tracking
export interface EnergyLog {
    id: string;
    level: 'low' | 'medium' | 'high';
    notes?: string;
    date: Date;
}

// Calendar Event
export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    description?: string;
    location?: string;
    source: 'task' | 'external';
    externalEventId?: string;
    taskId?: string;
}

// AI Breakdown Request/Response
export interface BreakdownRequest {
    goal: string;
    context?: string;
    deadline?: Date;
}

export interface BreakdownResponse {
    tasks: {
        title: string;
        description?: string;
        estimatedMinutes?: number;
    }[];
    suggestions?: string[];
} 