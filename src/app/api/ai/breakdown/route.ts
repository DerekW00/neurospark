import { NextRequest, NextResponse } from 'next/server';
import { breakdownGoal } from '@/services/ai/openai';
import { BreakdownRequest } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request
        if (!body.goal) {
            return NextResponse.json(
                { error: 'Goal is required' },
                { status: 400 }
            );
        }

        const breakdownRequest: BreakdownRequest = {
            goal: body.goal,
            context: body.context,
            deadline: body.deadline ? new Date(body.deadline) : undefined,
        };

        const result = await breakdownGoal(breakdownRequest);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in AI breakdown route:', error);
        return NextResponse.json(
            { error: 'Failed to process task breakdown' },
            { status: 500 }
        );
    }
} 