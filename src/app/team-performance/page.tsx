'use client';

import { motion } from 'framer-motion';
import { Group, TrendingUp, Shield, Target } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Progress } from '@/components/ui/progress';

const teamCohesionData = [
  { name: 'Team A', cohesion: 85, attendance: 95 },
  { name: 'Team B', cohesion: 78, attendance: 90 },
  { name: 'Team C', cohesion: 92, attendance: 98 },
  { name: 'Team D', cohesion: 65, attendance: 85 },
];

const performanceTrendData = [
  { month: 'Jan', offensive: 65, defensive: 58 },
  { month: 'Feb', offensive: 68, defensive: 62 },
  { month: 'Mar', offensive: 75, defensive: 65 },
  { month: 'Apr', offensive: 80, defensive: 72 },
  { month: 'May', offensive: 82, defensive: 78 },
  { month: 'Jun', offensive: 88, defensive: 85 },
];


const chartConfig = {
  cohesion: { label: 'Cohesion', color: 'hsl(var(--primary))' },
  attendance: { label: 'Attendance', color: 'hsl(var(--secondary-foreground))' },
  offensive: { label: 'Offensive Rating', color: 'hsl(var(--chart-1))' },
  defensive: { label: 'Defensive Rating', color: 'hsl(var(--chart-2))' },
};

export default function TeamPerformancePage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <Group className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Team Performance Analytics
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
            Insights into team dynamics and performance across your organized events.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Card className='glass-card h-full'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><TrendingUp className='w-5 h-5 text-primary'/> Overall Team Cohesion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold text-sm">Team A</h3>
                                    <span className='font-bold text-sm'>85%</span>
                                </div>
                                <Progress value={85} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold text-sm">Team B</h3>
                                    <span className='font-bold text-sm'>78%</span>
                                </div>
                                <Progress value={78} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold text-sm">Team C</h3>
                                    <span className='font-bold text-sm'>92%</span>
                                </div>
                                <Progress value={92} className="h-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <Card className='glass-card h-full'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><Target className='w-5 h-5 text-primary'/> Offensive Efficiency</CardTitle>
                        <CardDescription>Average points scored per game.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">14.2</p>
                        <p className="text-xs text-green-500 flex items-center gap-1"><TrendingUp className='w-4 h-4'/> +5.2% from last month</p>
                    </CardContent>
                </Card>
            </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <Card className='glass-card h-full'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><Shield className='w-5 h-5 text-primary'/> Defensive Strength</CardTitle>
                        <CardDescription>Average points conceded per game.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">9.8</p>
                         <p className="text-xs text-red-500 flex items-center gap-1"><TrendingUp className='w-4 h-4 rotate-180'/> -2.1% from last month</p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            >
            <Card className="w-full glass-card">
                <CardHeader>
                <CardTitle>Team Cohesion & Attendance</CardTitle>
                <CardDescription>
                    Comparing team cohesion scores with event attendance rates.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamCohesionData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegendContent />} />
                        <Bar dataKey="cohesion" fill="var(--color-cohesion)" radius={4} />
                        <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
                    </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
                </CardContent>
            </Card>
            </motion.div>
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            >
            <Card className="w-full glass-card">
                <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                    Monthly trend of offensive and defensive ratings for all teams combined.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceTrendData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent indicator='line' />} />
                        <Legend content={<ChartLegendContent />} />
                        <Line type="monotone" dataKey="offensive" stroke="var(--color-offensive)" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="defensive" stroke="var(--color-defensive)" strokeWidth={3} dot={false} />
                    </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
                </CardContent>
            </Card>
            </motion.div>
        </div>

      </div>
    </DashboardLayout>
  );
}
