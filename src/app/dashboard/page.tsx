"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import OrganizerDashboard from '@/components/dashboard/OrganizerDashboard';
import ParticipantDashboard from '@/components/dashboard/ParticipantDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const renderDashboard = () => {
    if (loading || !user) {
        return (
          <div className="p-8">
            <Skeleton className="h-8 w-1/3 mb-8" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </div>
            <Skeleton className="h-96 rounded-lg" />
          </div>
        );
      }

    switch (user.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Organizer':
        return <OrganizerDashboard user={user} />;
      case 'Participant':
        return <ParticipantDashboard user={user} />;
      default:
        // This case should not be reached with a valid user object
        router.push('/');
        return null;
    }
  };

  return (
    <DashboardLayout>
        {renderDashboard()}
    </DashboardLayout>
  );
}
