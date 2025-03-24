'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import TaskBreakdown from '@/components/tasks/TaskBreakdown';

export default function OnboardingPage() {
    const router = useRouter();
    const { addGoal, completeOnboarding, setCalendarConnected } = useAppStore();
    const [step, setStep] = useState(1);
    const [goalTitle, setGoalTitle] = useState('');
    const [goalDesc, setGoalDesc] = useState('');
    const [goalDeadline, setGoalDeadline] = useState('');
    const [goalId, setGoalId] = useState('');

    // Handle moving to the next step
    const handleNextStep = () => {
        if (step === 1) {
            // If we're on step 1 (entering goal), create the goal first
            const newGoal = {
                title: goalTitle,
                description: goalDesc,
                dueDate: goalDeadline ? new Date(goalDeadline) : undefined,
                status: 'active' as const,
            };

            // Add the goal to the store and save its ID
            const createdGoal = addGoal(newGoal);
            if (typeof createdGoal === 'object' && 'id' in createdGoal) {
                setGoalId(createdGoal.id);
            }
        }

        setStep(step + 1);
    };

    // Handle completing the onboarding
    const handleComplete = () => {
        completeOnboarding();
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Welcome to NeuroSpark
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Let's get you set up to conquer your goals without overwhelm
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Onboarding progress */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between md:px-10">
                            {[1, 2, 3].map((stepNumber) => (
                                <div
                                    key={stepNumber}
                                    className={`flex flex-col items-center ${stepNumber < step
                                        ? 'text-indigo-600'
                                        : stepNumber === step
                                            ? 'text-indigo-600'
                                            : 'text-gray-400'
                                        }`}
                                >
                                    <div
                                        className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${stepNumber < step
                                            ? 'border-indigo-600 bg-indigo-600 text-white'
                                            : stepNumber === step
                                                ? 'border-indigo-600 text-indigo-600'
                                                : 'border-gray-300'
                                            }`}
                                    >
                                        {stepNumber < step ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            stepNumber
                                        )}
                                    </div>
                                    <div className="text-sm font-medium mt-2">
                                        {stepNumber === 1 ? 'Goal' : stepNumber === 2 ? 'Breakdown' : 'Calendar'}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-between">
                                <div className={`w-1/3 border-t-2 ${step > 1 ? 'border-indigo-600' : 'border-transparent'}`}></div>
                                <div className={`w-1/3 border-t-2 ${step > 2 ? 'border-indigo-600' : 'border-transparent'}`}></div>
                            </div>
                        </div>
                    </div>

                    {/* Step content */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">What's one goal you'd like help with?</h3>
                            <p className="text-sm text-gray-500">
                                Start with just one goal that feels overwhelming or that you've been putting off.
                                We'll help you break it down into manageable steps.
                            </p>

                            <div>
                                <label htmlFor="goal-title" className="block text-sm font-medium text-gray-700">
                                    Goal Title
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="goal-title"
                                        name="goal-title"
                                        value={goalTitle}
                                        onChange={(e) => setGoalTitle(e.target.value)}
                                        placeholder="e.g., Organize my home office"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="goal-desc" className="block text-sm font-medium text-gray-700">
                                    Description (Optional)
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="goal-desc"
                                        name="goal-desc"
                                        rows={3}
                                        value={goalDesc}
                                        onChange={(e) => setGoalDesc(e.target.value)}
                                        placeholder="Any details that will help break this down?"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="goal-deadline" className="block text-sm font-medium text-gray-700">
                                    Deadline (Optional)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="date"
                                        id="goal-deadline"
                                        name="goal-deadline"
                                        value={goalDeadline}
                                        onChange={(e) => setGoalDeadline(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    disabled={!goalTitle.trim()}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    Next: Break Down This Goal
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <TaskBreakdown
                                goalTitle={goalTitle}
                                deadline={goalDeadline ? new Date(goalDeadline) : undefined}
                                onComplete={handleNextStep}
                                goalId={goalId}
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Connect Your Calendar</h3>
                            <p className="text-sm text-gray-500">
                                Connecting your calendar helps visualize your tasks alongside your existing commitments,
                                making it easier to plan realistically.
                            </p>

                            <div className="bg-indigo-50 p-4 rounded-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-indigo-700">
                                            This is optional. You can always connect your calendar later in Settings.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    type="button"
                                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={() => {
                                        setCalendarConnected(true);
                                        alert('Google Calendar connected successfully!');
                                    }}
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c1.054,0,1.909-0.855,1.909-1.909V8.614 c0-1.054-0.855-1.909-1.909-1.909h-3.536c-1.054,0-1.909,0.855-1.909,1.909V12.151z M8.028,12.151L8.028,12.151 c0,1.054-0.855,1.909-1.909,1.909H2.582c-1.054,0-1.909-0.855-1.909-1.909V8.614c0-1.054,0.855-1.909,1.909-1.909h3.536 c1.054,0,1.909,0.855,1.909,1.909V12.151z M12.545,21.386L12.545,21.386c0,1.054,0.855,1.909,1.909,1.909h3.536 c1.054,0,1.909-0.855,1.909-1.909v-3.536c0-1.054-0.855-1.909-1.909-1.909h-3.536c-1.054,0-1.909,0.855-1.909,1.909V21.386z M8.028,21.386L8.028,21.386c0,1.054-0.855,1.909-1.909,1.909H2.582c-1.054,0-1.909-0.855-1.909-1.909v-3.536 c0-1.054,0.855-1.909,1.909-1.909h3.536c1.054,0,1.909,0.855,1.909,1.909V21.386z M8.028,2.582V6.118 c0,1.054-0.855,1.909-1.909,1.909H2.582c-1.054,0-1.909-0.855-1.909-1.909V2.582c0-1.054,0.855-1.909,1.909-1.909h3.536 C7.173,0.673,8.028,1.528,8.028,2.582z M18.001,0.673h-3.536c-1.054,0-1.909,0.855-1.909,1.909v3.536 c0,1.054,0.855,1.909,1.909,1.909h3.536c1.054,0,1.909-0.855,1.909-1.909V2.582C19.91,1.528,19.055,0.673,18.001,0.673z"></path>
                                    </svg>
                                    Connect Google Calendar
                                </button>

                                <button
                                    type="button"
                                    className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => {
                                        setCalendarConnected(true);
                                        alert('Apple Calendar connected successfully!');
                                    }}
                                >
                                    <svg className="w-5 h-5 mr-2 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1" />
                                    </svg>
                                    Connect Apple Calendar
                                </button>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={handleComplete}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Complete Setup & Go to Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 