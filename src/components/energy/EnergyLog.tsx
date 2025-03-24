import React, { useState } from 'react';
import { useAppStore } from '@/store';

export default function EnergyLog() {
    const { todaysEnergy, logEnergy } = useAppStore();
    const [notes, setNotes] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleEnergyLog = (level: 'low' | 'medium' | 'high') => {
        logEnergy(level, notes);
        setNotes('');

        // Show success message
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                How's your energy today?
            </h2>

            <p className="text-gray-600 mb-6">
                Tracking your energy helps you plan better. On low energy days, focus on just one key task.
                On high energy days, tackle your more challenging tasks!
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                    onClick={() => handleEnergyLog('low')}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${todaysEnergy === 'low'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                        }`}
                >
                    <span className="text-4xl mb-2">🥱</span>
                    <span className={`font-medium ${todaysEnergy === 'low' ? 'text-red-600' : 'text-gray-800'}`}>
                        Low
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                        Tired, unfocused
                    </span>
                </button>

                <button
                    onClick={() => handleEnergyLog('medium')}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${todaysEnergy === 'medium'
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                        }`}
                >
                    <span className="text-4xl mb-2">🙂</span>
                    <span className={`font-medium ${todaysEnergy === 'medium' ? 'text-yellow-600' : 'text-gray-800'}`}>
                        Medium
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                        Average, steady
                    </span>
                </button>

                <button
                    onClick={() => handleEnergyLog('high')}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${todaysEnergy === 'high'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                        }`}
                >
                    <span className="text-4xl mb-2">😃</span>
                    <span className={`font-medium ${todaysEnergy === 'high' ? 'text-green-600' : 'text-gray-800'}`}>
                        High
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                        Focused, motivated
                    </span>
                </button>
            </div>

            <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                </label>
                <textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Why do you feel this way? Any patterns you notice?"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
            </div>

            {showSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">
                                Your energy level has been logged!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {todaysEnergy && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Today's recommendation:</h3>

                    {todaysEnergy === 'low' && (
                        <p className="text-gray-600">
                            Your energy is low today. Focus on just one important task, keep it small, and be kind to yourself.
                            Consider scheduling more challenging tasks for a higher energy day.
                        </p>
                    )}

                    {todaysEnergy === 'medium' && (
                        <p className="text-gray-600">
                            Your energy is steady today. This is a good day to make progress on your ongoing tasks.
                            Try to complete 2-3 medium-priority items from your list.
                        </p>
                    )}

                    {todaysEnergy === 'high' && (
                        <p className="text-gray-600">
                            Your energy is high today! This is the perfect time to tackle challenging tasks that require focus.
                            Take advantage of your motivation to make significant progress.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
} 