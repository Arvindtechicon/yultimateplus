
'use client';

import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import OrganizerRegistrationForm from '@/components/auth/OrganizerRegistrationForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OrganizerRegistrationPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-purple-50/20 to-pink-50/20 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20"></div>
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 opacity-20 blur-3xl dark:from-indigo-800 dark:to-purple-800 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-tl from-pink-200 to-purple-200 opacity-20 blur-3xl dark:from-pink-800 dark:to-purple-800 animate-pulse-slow"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <Card className="glass-card">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 dark:bg-primary/20 p-4 rounded-full w-fit mb-4">
              <UserPlus className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Organizer Registration
            </CardTitle>
            <CardDescription>
              Create an account to start organizing events and building
              communities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizerRegistrationForm />
            <div className="mt-6 text-center text-sm">
              <Button asChild variant="link">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
