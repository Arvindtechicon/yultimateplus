
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import {
  Disc3,
  LogIn,
  UserPlus,
  Briefcase,
  Heart,
  Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  const handleAdminLogin = () => {
    setEmail('admin123@yultimate.com');
    setPassword('admin@2025');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-purple-50/20 to-pink-50/20 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20"></div>
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 opacity-20 blur-3xl dark:from-indigo-800 dark:to-purple-800 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-tl from-pink-200 to-purple-200 opacity-20 blur-3xl dark:from-pink-800 dark:to-purple-800 animate-pulse-slow"></div>
      </div>
      <Header />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] container py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-block p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-full shadow-inner border border-primary/20">
            <Disc3 className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Y-Ultimate Pulse
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Connecting Students, Events & Innovation.
          </p>
        </motion.div>

        <Card className="w-full max-w-sm glass-card">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Login or register to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
                <div className="mt-4 text-center">
                   <Button variant="link" size="sm" onClick={handleAdminLogin}>
                      <Shield className="mr-2 h-4 w-4" />
                      Login as Admin
                    </Button>
                </div>
              </TabsContent>
              <TabsContent value="register">
                <div className="space-y-4 pt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Choose your role to get started:
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/register/participant`}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up as Participant
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/register/organizer`}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Sign Up as Organizer
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/register/coach`}>
                      <Heart className="mr-2 h-4 w-4" />
                      Sign Up as Coach
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
