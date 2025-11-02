'use client';

import type { User } from '@/lib/mockData';
import { venues, mockChildren, mockAssessments, mockSessions } from '@/lib/mockData';
import { CalendarCheck, Search, Trophy, X, BookOpen, Home, BarChart2, AlertTriangle, QrCode, Info } from 'lucide-react';
import { StatCard } from './StatCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAppData } from '@/context/EventContext';
import { useMemo, useState } from 'react';
import { Input } from '../ui/input';
import EventCard from '../EventCard';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  PolarGrid,
  PolarAngleAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
} from 'recharts';
import { Alert, AlertTitle } from '../ui/alert';
import QRCodeComponent from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useAuth } from '@/context/AuthContext';

interface ParticipantDashboardProps {
  user: User;
}

const chartConfig = {
  score: { label: 'Score', color: 'hsl(var(--primary))' },
  baseline: { label: 'Baseline', color: 'hsl(var(--muted-foreground))' },
  endline: { label: 'Endline', color: 'hsl(var(--primary))' },
  attended: { label: 'Attended', color: 'hsl(var(--primary))' },
};

export default function ParticipantDashboard({
  user,
}: ParticipantDashboardProps) {
  const { events, coachingCenters, alerts } = useAppData();

  // Find the child data that corresponds to the logged-in participant user
  const child = useMemo(() => mockChildren.find(c => c.name.toLowerCase().includes(user.name.split(' ')[0].toLowerCase())) || mockChildren[0], [user.name]);
  
  const childAssessments = mockAssessments.filter(a => a.childId === child.id);
  const baseline = childAssessments.find(a => a.type === 'Baseline');
  const endline = childAssessments.find(a => a.type === 'Endline');

  const assessmentData = useMemo(() => {
    const categories = ['teamwork', 'confidence', 'communication'];
    return categories.map(category => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      baseline: baseline?.score[category as keyof typeof baseline.score] || 0,
      endline: endline?.score[category as keyof typeof endline.score] || 0,
    }));
  }, [baseline, endline]);
  
  const registeredEvents = useMemo(() => {
    return events
      .filter(event => event.participants.includes(user.id) && new Date(event.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, user.id]);

  const attendanceData = useMemo(() => {
      const childSessions = mockSessions.filter(s => s.status === 'completed');
      return childSessions.map(session => ({
          date: format(new Date(session.date), 'MMM d'),
          attended: session.participants.includes(child.id) ? 1 : 0
      }))
  }, [child.id]);
  
  const homeVisits = useMemo(() => {
    // This is a mock since home visits are not in the data model yet
    return [
      { date: '2025-10-15', notes: 'Discussed progress and upcoming community day.' },
      { date: '2025-09-20', notes: 'Initial visit, parents are very supportive.' },
    ]
  }, []);

  const totalSessionsAttended = attendanceData.filter(d => d.attended).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start"
        >
        <h1 className="text-3xl font-bold">
            Welcome, {child.name.split(' ')[0]}!
        </h1>
      </motion.div>

       <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
          {alerts.map(a => (
            <Alert key={a.id} variant={a.type}>
              {a.type === 'destructive' ? <AlertTriangle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
              <AlertTitle>{a.message}</AlertTitle>
            </Alert>
          ))}
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          title="Sessions Attended"
          value={totalSessionsAttended}
          icon={CalendarCheck}
          description={`Out of ${mockSessions.filter(s => s.status === 'completed').length} completed sessions`}
        />
        <StatCard
          title="Total Assessments"
          value={childAssessments.length}
          icon={Trophy}
          description="Baseline and Endline scores"
        />
        <StatCard
          title="Home Visits"
          value={homeVisits.length}
          icon={Home}
          description="Visits logged by your coach"
        />
      </motion.div>

      <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>My Upcoming Events</CardTitle>
                    <CardDescription>Your QR codes for check-in.</CardDescription>
                </CardHeader>
                <CardContent>
                    {registeredEvents.length > 0 ? (
                        <div className="space-y-4">
                            {registeredEvents.map(event => {
                                const qrValue = JSON.stringify({ eventId: event.id, eventName: event.name, userId: user.id, userName: user.name });
                                return (
                                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div>
                                            <p className="font-semibold">{event.name}</p>
                                            <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'PPPP p')}</p>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">
                                                    <QrCode className="mr-2 h-4 w-4" />
                                                    Show QR Code
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px] glass-card">
                                                <DialogHeader>
                                                    <DialogTitle className='text-center'>{event.name}</DialogTitle>
                                                </DialogHeader>
                                                <div className="flex flex-col items-center justify-center p-4 gap-4">
                                                    <div className="bg-white p-4 rounded-lg">
                                                        <QRCodeComponent value={qrValue} size={256} />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground text-center">Show this QR code to the event organizer to check in.</p>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-sm text-muted-foreground">You are not registered for any upcoming events.</p>
                            <Button asChild variant="link" className='mt-2'>
                                <Link href="/events">Browse Events</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
         >
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart2 /> My Attendance Summary</CardTitle>
                    <CardDescription>Your attendance record for completed sessions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <ResponsiveContainer>
                            <BarChart data={attendanceData}>
                                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value > 0 ? 'Attended' : ''} domain={[0, 1]} />
                                <Tooltip cursor={false} content={<ChartTooltipContent formatter={(value) => value > 0 ? 'Attended' : 'Absent'} hideLabel />} />
                                <Bar dataKey="attended" fill="var(--color-attended)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>My Assessments</CardTitle>
                    <CardDescription>Comparison of your Baseline and Endline scores.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <ResponsiveContainer>
                            <RadarChart data={assessmentData}>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <PolarAngleAxis dataKey="category" />
                                <PolarGrid />
                                <Radar name="Baseline" dataKey="baseline" stroke="var(--color-baseline)" fill="var(--color-baseline)" fillOpacity={0.6} />
                                <Radar name="Endline" dataKey="endline" stroke="var(--color-endline)" fill="var(--color-endline)" fillOpacity={0.6} />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </motion.div>
      </div>

       <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle>Home Visit Summary</CardTitle>
              <CardDescription>
                A summary of the last 2 home visits from your coach.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {homeVisits.length > 0 ? (
                <div className="space-y-4">
                  {homeVisits.slice(0, 2).map((visit, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <p className="font-semibold">{format(new Date(visit.date), 'PPPP')}</p>
                      <p className="text-sm text-muted-foreground mt-1">{visit.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No home visits have been logged yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
    </div>
  );
}
