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
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--primary)] mb-4">NeuroSpark</h1>
        <p className="text-[var(--muted-foreground)]">Loading your experience...</p>
      </div>
    </div>
  );
}
