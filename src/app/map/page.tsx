
"use client";

import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import MapComponent from '@/components/MapComponent';
import DashboardLayout from '@/components/DashboardLayout';

function MapPage() {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return (
            <DashboardLayout>
                <div className="container mx-auto py-10 flex items-center justify-center h-full">
                    <div className="max-w-md text-center p-8 bg-card rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-destructive mb-4">Google Maps API Key Missing</h2>
                        <p className='text-muted-foreground'>Please add your Google Maps API Key to continue. Create a <code className='bg-muted p-1 rounded'>.env.local</code> file in the root of your project and add the following:</p>
                        <pre className="bg-muted p-2 rounded-md my-4 text-sm dark:bg-background/50">
                            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=Your_API_Key_Here
                        </pre>
                        <p className='text-sm text-muted-foreground'>You will need to restart your development server after adding the key.</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

  return (
    <DashboardLayout>
        <MapComponent />
    </DashboardLayout>
  );
}

export default function MapPageWrapper() {
  return (
    <Suspense fallback={<DashboardLayout><div className='p-8'><Skeleton className='h-[calc(100vh-10rem)] w-full' /></div></DashboardLayout>}>
      <MapPage />
    </Suspense>
  )
}
