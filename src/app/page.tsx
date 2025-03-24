'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';

export default function Home() {
  const router = useRouter();
  const { isOnboarding } = useAppStore();

  // Redirect to the appropriate page based on onboarding status
  useEffect(() => {
    if (isOnboarding) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  }, [isOnboarding, router]);

  // Display a loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">NeuroSpark</h1>
        <p className="text-gray-500">Loading your experience...</p>
      </div>
    </div>
  );
}
