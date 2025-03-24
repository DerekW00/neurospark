import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import { getPendingCheckIns } from '@/services/notification';

export default function CheckInReminder() {
    const { checkIns, completeCheckIn, skipCheckIn } = useAppStore();
    const [currentCheckIn, setCurrentCheckIn] = useState<typeof checkIns[0] | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Find any pending check-ins
    useEffect(() => {
        const pendingCheckIns = getPendingCheckIns(checkIns);
        if (pendingCheckIns.length > 0 && !currentCheckIn) {
            setCurrentCheckIn(pendingCheckIns[0]);
            setIsVisible(true);
        }
    }, [checkIns, currentCheckIn]);

    // Handle completing a check-in
    const handleComplete = () => {
        if (currentCheckIn) {
            completeCheckIn(currentCheckIn.id);
            setIsVisible(false);

            // Clear current check-in after animation completes
            setTimeout(() => {
                setCurrentCheckIn(null);
            }, 300);
        }
    };

    // Handle skipping a check-in
    const handleSkip = () => {
        if (currentCheckIn) {
            skipCheckIn(currentCheckIn.id);
            setIsVisible(false);

            // Clear current check-in after animation completes
            setTimeout(() => {
                setCurrentCheckIn(null);
            }, 300);
        }
    };

    if (!currentCheckIn) return null;

    return (
        <div
            className={`bg-indigo-100 border-l-4 border-indigo-500 p-4 transition-all duration-300 ${isVisible ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-800">
                        {currentCheckIn.message}
                    </p>
                    <p className="mt-1 text-xs text-indigo-600">
                        {new Date(currentCheckIn.scheduledFor).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={handleComplete}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition-colors"
                    >
                        Done
                    </button>
                    <button
                        onClick={handleSkip}
                        className="bg-white text-indigo-600 px-3 py-1 rounded-md text-sm border border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                        Later
                    </button>
                </div>
            </div>
        </div>
    );
} 