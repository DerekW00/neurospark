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
            className={`bg-[var(--primary)] bg-opacity-10 border-l-4 border-[var(--primary)] p-4 transition-all duration-300 ${isVisible ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                        {currentCheckIn.message}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        {new Date(currentCheckIn.scheduledFor).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={handleComplete}
                        className="bg-[var(--primary)] text-white px-3 py-1 rounded-md text-sm hover:bg-opacity-90 transition-colors"
                    >
                        Done
                    </button>
                    <button
                        onClick={handleSkip}
                        className="bg-[var(--card)] text-[var(--primary)] px-3 py-1 rounded-md text-sm border border-[var(--primary)] border-opacity-30 hover:bg-[var(--card-alt)] transition-colors"
                    >
                        Later
                    </button>
                </div>
            </div>
        </div>
    );
} 