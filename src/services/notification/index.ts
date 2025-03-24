import { CheckIn, Task } from '@/types';

/**
 * Generate check-in messages based on time of day and user's tasks
 */
export function generateCheckInMessage(
    type: CheckIn['type'],
    tasks: Task[] = [],
    todaysEnergy?: 'low' | 'medium' | 'high'
): string {
    const pendingTasks = tasks.filter(task => task.status !== 'completed');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    const taskCount = pendingTasks.length;
    const completedCount = completedTasks.length;

    // Adjust messages based on energy level
    const energyPrefix = todaysEnergy === 'low'
        ? 'Since your energy is low today, focus on just one key task. Everything else is a bonus! '
        : todaysEnergy === 'high'
            ? "You're feeling energetic today! A great day to tackle more challenging tasks. "
            : '';

    switch (type) {
        case 'morning':
            if (taskCount === 0) {
                return `${energyPrefix}Good morning! You don't have any tasks scheduled for today yet. Would you like to plan your day now?`;
            }
            return `${energyPrefix}Good morning! You have ${taskCount} task${taskCount === 1 ? '' : 's'} planned for today. Ready to get started?`;

        case 'midday':
            if (completedCount === 0) {
                return `How's your day going? Remember, starting is often the hardest part. Can you take just 5 minutes to begin your first task?`;
            } else if (completedCount > 0 && taskCount > 0) {
                return `You've completed ${completedCount} task${completedCount === 1 ? '' : 's'} today - that's great! You have ${taskCount} more to go. Which one will you tackle next?`;
            }
            return `You've completed all your tasks for today! Would you like to plan something else or take a well-deserved break?`;

        case 'evening':
            if (completedCount === 0 && taskCount > 0) {
                return `Day wrapping up! Don't worry if you didn't complete tasks today - tomorrow is a fresh start. Would you like to reschedule anything?`;
            } else if (completedCount > 0 && taskCount > 0) {
                return `You completed ${completedCount} task${completedCount === 1 ? '' : 's'} today! That's progress to celebrate. ${taskCount} will carry over to tomorrow.`;
            } else if (completedCount > 0 && taskCount === 0) {
                return `Amazing job today! You completed all ${completedCount} of your planned tasks. Take some time to enjoy that feeling of accomplishment!`;
            }
            return `Time to wind down for the day. Would you like to plan some tasks for tomorrow?`;

        case 'task-specific':
            return `It's time to work on your scheduled task. Ready to get started?`;

        default:
            return `NeuroSpark check-in: You have ${taskCount} pending tasks.`;
    }
}

/**
 * Schedule check-ins for the day
 * This is a placeholder implementation - in a real app, you would use a notification system
 */
export function scheduleCheckIns(date: Date = new Date()): CheckIn[] {
    // Create standard check-ins for morning, midday, and evening
    const checkIns: CheckIn[] = [];

    // Clone the date to avoid modifying the original
    const checkInDate = new Date(date);

    // Set hours for morning check-in (9 AM)
    checkInDate.setHours(9, 0, 0, 0);
    checkIns.push({
        id: `morning-${checkInDate.toISOString()}`,
        type: 'morning',
        status: 'pending',
        message: generateCheckInMessage('morning'),
        scheduledFor: new Date(checkInDate),
    });

    // Set hours for midday check-in (1 PM)
    checkInDate.setHours(13, 0, 0, 0);
    checkIns.push({
        id: `midday-${checkInDate.toISOString()}`,
        type: 'midday',
        status: 'pending',
        message: generateCheckInMessage('midday'),
        scheduledFor: new Date(checkInDate),
    });

    // Set hours for evening check-in (7 PM)
    checkInDate.setHours(19, 0, 0, 0);
    checkIns.push({
        id: `evening-${checkInDate.toISOString()}`,
        type: 'evening',
        status: 'pending',
        message: generateCheckInMessage('evening'),
        scheduledFor: new Date(checkInDate),
    });

    return checkIns;
}

/**
 * Check if there are any pending check-ins
 */
export function getPendingCheckIns(checkIns: CheckIn[]): CheckIn[] {
    const now = new Date();

    return checkIns
        .filter(checkIn =>
            checkIn.status === 'pending' &&
            checkIn.scheduledFor <= now
        )
        .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
} 