'use server';

import OpenAI from 'openai';
import { BreakdownRequest, BreakdownResponse } from '../../types';

// Initialize OpenAI client (server-side only)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Breaks down a goal into smaller, manageable tasks using OpenAI
 * This should only be called from API routes, not directly from client components
 */
export async function breakdownGoal(request: BreakdownRequest): Promise<BreakdownResponse> {
    try {
        const contextStr = request.context ? `Additional context: ${request.context}` : '';
        const deadlineStr = request.deadline
            ? `This needs to be completed by ${request.deadline.toLocaleDateString()}.`
            : '';

        const prompt = `
      Break down the following goal into 5-7 specific, actionable tasks with time estimates. 
      These should be small enough that each can be completed in less than an hour.
      
      GOAL: ${request.goal}
      ${contextStr}
      ${deadlineStr}
      
      Format your response as a JSON object with the following structure:
      {
        "tasks": [
          {
            "title": "Task name",
            "description": "Brief description of what to do",
            "estimatedMinutes": estimated time in minutes (integer)
          }
        ],
        "suggestions": [
          "Any helpful tips or suggestions for approaching this goal"
        ]
      }
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an ADHD coach assistant that helps break down tasks into manageable chunks. You provide clear, concise steps that are easy to follow and not overwhelming."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
            throw new Error('No content returned from OpenAI');
        }

        return JSON.parse(content) as BreakdownResponse;
    } catch (error) {
        console.error('Error breaking down goal:', error);

        // Return a fallback response
        return {
            tasks: [
                {
                    title: `Start working on: ${request.goal}`,
                    description: 'Begin with the first step that comes to mind',
                    estimatedMinutes: 30,
                },
                {
                    title: 'Plan the next steps',
                    description: 'Write down what needs to be done after the first step',
                    estimatedMinutes: 15,
                },
            ],
            suggestions: [
                'Try breaking this down further on your own',
                'Consider what small win you can achieve first'
            ]
        };
    }
}

/**
 * Generates a suggested schedule for tasks based on their estimates and deadlines
 * This is a utility function that can be used on the client side
 */
export async function suggestSchedule(tasks: BreakdownResponse['tasks'], deadline?: Date) {
    // This could be enhanced with more AI functionality in the future
    // For now, a simple algorithm to distribute tasks

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
} 