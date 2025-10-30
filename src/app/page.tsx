"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Disc3, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/mockData';

export default function Home() {
  const { login, user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleLogin = (role: User['role']) => {
    login(role);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 container animate-fade-in-up">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-primary/10 rounded-full">
          <Disc3 className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground/80">
          Welcome to Y-Ultimate Pulse
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl">
          Your central hub for everything Ultimate Frisbee. Login to view your personalized dashboard.
        </p>
      </div>

      <Card className="mt-10 w-full max-w-sm">
        <CardHeader>
          <CardTitle>Simulate Login</CardTitle>
          <CardDescription>Select a role to experience the app.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={() => handleLogin('Admin')} className="w-full" size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Login as Admin
          </Button>
          <Button onClick={() => handleLogin('Organizer')} className="w-full" variant="secondary" size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Login as Organizer
          </Button>
          <Button onClick={() => handleLogin('Participant')} className="w-full" variant="outline" size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Login as Participant
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
