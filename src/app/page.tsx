
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
  Heart,
  LogIn,
  UserPlus,
  Briefcase,
  ArrowRight,
  Shield,
  Trophy,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const RoleCard = ({ icon, title, description, loginAction, registerHref }: { icon: React.ReactNode, title: string, description: string, loginAction: () => void, registerHref: string }) => {
    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: '0px 10px 30px rgba(99, 60, 255, 0.2)' }}
            className="flex-1"
        >
            <Card className="glass-card flex flex-col items-center text-center h-full p-6">
                <CardHeader className="p-0 items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        {icon}
                    </div>
                    <CardTitle className="text-2xl">{title}</CardTitle>
                    <CardDescription className="mt-2">{description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-grow w-full flex flex-col justify-end mt-6 gap-3">
                    <Button onClick={loginAction} className="w-full">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login as {title}
                    </Button>
                     <Button variant="outline" className="w-full" asChild>
                        <Link href={registerHref}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Sign Up as {title}
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const LoginModal = ({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, password);
    };

    const handleAdminLogin = () => {
        setEmail('admin123@yultimate.com');
        setPassword('admin@2025');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md glass-card">
                <DialogHeader>
                    <DialogTitle>Welcome Back</DialogTitle>
                    <DialogDescription>
                        Enter your credentials to access your account.
                    </DialogDescription>
                </DialogHeader>
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
                        <LogIn className="mr-2 h-4 w-4" /> Login
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function Home() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

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

  const openLogin = () => setLoginModalOpen(true);
  
  const handleAdminLoginClick = () => {
    login('admin123@yultimate.com', 'admin@2025');
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
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Y-Ultimate Pulse
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Connecting Students, Events & Innovation.
          </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-5xl flex flex-col md:flex-row gap-8"
        >
            <RoleCard 
                icon={<Heart className="w-8 h-8 text-primary" />}
                title="Coach"
                description="Manage sessions and track child progress."
                loginAction={openLogin}
                registerHref="/register/coach"
            />
             <RoleCard 
                icon={<Briefcase className="w-8 h-8 text-primary" />}
                title="Organizer"
                description="Create and manage your own events."
                loginAction={openLogin}
                registerHref="/register/organizer"
            />
             <RoleCard 
                icon={<Trophy className="w-8 h-8 text-primary" />}
                title="Participant"
                description="Join events and track your activity."
                loginAction={openLogin}
                registerHref="/register/participant"
            />
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
        >
            <Button variant="link" onClick={handleAdminLoginClick}>
                <Shield className="mr-2 h-4 w-4" />
                Login as Admin
            </Button>
        </motion.div>

        <LoginModal isOpen={isLoginModalOpen} onOpenChange={setLoginModalOpen} />

      </main>
      <footer className="relative z-10 py-4 text-center text-sm text-muted-foreground">
        built with ❤️ by Tech Terrific
      </footer>
    </div>
  );
}
