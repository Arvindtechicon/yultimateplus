
'use client';

import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Palette, LogOut, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { user, logout, loading } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
  };
  
  if (loading || !user) {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                 <Skeleton className="h-12 w-1/3" />
                 <Skeleton className="h-48 w-full" />
                 <Skeleton className="h-32 w-full" />
                 <Skeleton className="h-32 w-full" />
            </div>
        </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <div className="inline-block p-4 bg-primary/10 rounded-full">
            <SettingsIcon className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                Settings
            </h1>
            <p className="text-muted-foreground md:text-xl mt-2">
                Manage your account and preferences.
            </p>
          </div>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User /> Profile</CardTitle>
                        <CardDescription>This is your public information.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-6">
                        <Avatar className="h-20 w-20 border-2 border-primary">
                            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.name}`} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="text-2xl font-semibold">{user.name}</p>
                            <p className="text-muted-foreground">{user.email}</p>
                            <p className="text-sm pt-1"><span className="font-semibold">Role:</span> {user.role}</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Palette/> Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of the app.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="theme-select">Theme</Label>
                             <Select value={theme} onValueChange={handleThemeChange}>
                                <SelectTrigger id="theme-select" className="w-[200px]">
                                    <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">
                                        <div className="flex items-center gap-2"><Sun className="w-4 h-4" /> Light</div>
                                    </SelectItem>
                                    <SelectItem value="dark">
                                        <div className="flex items-center gap-2"><Moon className="w-4 h-4" /> Dark</div>
                                    </SelectItem>
                                    <SelectItem value="system">
                                        <div className="flex items-center gap-2"><Monitor className="w-4 h-4" /> System</div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="glass-card border-destructive/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive"><LogOut /> Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" onClick={logout}>
                            Log Out
                        </Button>
                         <p className="text-sm text-muted-foreground mt-2">This will log you out of your account on this device.</p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
