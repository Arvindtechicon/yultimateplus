'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Disc3, LogIn, User, Shield, Trophy, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { User as UserType } from '@/lib/mockData';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useEffect } from 'react';

export default function Home() {
  const { login, user, loading } = useAuth();
  const router = useRouter();

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

  const handleLogin = (role: UserType['role']) => {
    login(role);
  };

  const loginOptions = [
    { role: 'Organizer' as const, icon: User, title: 'Coach', description: 'Manage sessions and track child progress.' },
    { role: 'Organizer' as const, icon: Briefcase, title: 'Organizer', description: 'Create and manage your own events.' },
    { role: 'Participant' as const, icon: Trophy, title: 'Participant', description: 'Join events and track your activity.' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
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
          <div className="inline-block p-4 bg-primary/10 rounded-full">
            <Disc3 className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Y-Ultimate Pulse
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Connecting Students, Events & Innovation.
          </p>
        </motion.div>

        <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          {loginOptions.map((option) => (
            <motion.div key={option.title} variants={itemVariants}>
              <Card className="text-center glass-card hover:scale-105 hover:border-primary/50 transition-all duration-300 group">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 dark:bg-primary/20 p-4 rounded-full w-fit mb-2 group-hover:scale-110 transition-transform duration-300">
                        <option.icon className="w-8 h-8 text-primary" />
                    </div>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => handleLogin(option.role)} className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login as {option.title}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
            className="mt-8 text-center"
            initial={{y:20, opacity:0}}
            animate={{y:0, opacity:1}}
            transition={{delay: 0.5}}
            >
             <Button variant="link" onClick={() => handleLogin('Admin')}>
                <Shield className="mr-2 h-4 w-4" />
                Login as Admin
            </Button>
        </motion.div>
      </main>
    </div>
  );
}
