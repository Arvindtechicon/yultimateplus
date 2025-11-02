'use client';

import { motion } from 'framer-motion';
import { Download, BarChart2, Users, PieChart as PieChartIcon, Activity } from 'lucide-react';
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
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useMemo } from 'react';
import { mockChildren, mockSessions } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary-foreground))'];

const coachActivityData = [
    { month: 'Jan', hours: 120 },
    { month: 'Feb', hours: 140 },
    { month: 'Mar', hours: 130 },
    { month: 'Apr', hours: 150 },
    { month: 'May', hours: 160 },
    { month: 'Jun', hours: 155 },
];

const chartConfig = {
    children: { label: 'Children', color: 'hsl(var(--primary))' },
    male: { label: 'Male', color: 'hsl(var(--chart-1))' },
    female: { label: 'Female', color: 'hsl(var(--chart-2))' },
    hours: { label: 'Activity Hours', color: 'hsl(var(--primary))' },
};

export default function ReportsPage() {
    const { toast } = useToast();

    const communityData = useMemo(() => {
        const communities: { [key: string]: { children: number, attendance: number[] } } = {};
        
        mockChildren.forEach(child => {
            if (!communities[child.community]) {
                communities[child.community] = { children: 0, attendance: [] };
            }
            communities[child.community].children++;
        });

        mockSessions.forEach(session => {
            if (communities[session.community] && session.status === 'completed') {
                const totalPossible = mockChildren.filter(c => c.community === session.community).length;
                if (totalPossible > 0) {
                    const attendancePercentage = (session.participants.length / totalPossible) * 100;
                    communities[session.community].attendance.push(attendancePercentage);
                }
            }
        });

        return Object.entries(communities).map(([name, data]) => {
            const avgAttendance = data.attendance.length > 0 ? data.attendance.reduce((a, b) => a + b, 0) / data.attendance.length : 0;
            return { name, children: data.children, avgAttendance };
        });
    }, []);

    const genderData = useMemo(() => {
        const maleCount = mockChildren.filter(c => c.gender === 'Male').length;
        const femaleCount = mockChildren.filter(c => c.gender === 'Female').length;
        return [
            { name: 'Male', value: maleCount },
            { name: 'Female', value: femaleCount },
        ];
    }, []);

    const handleDownload = (reportName: string) => {
        toast({
            title: 'Download Started (Mock)',
            description: `A CSV for the ${reportName} report is being generated.`,
        });
    };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12"
        >
            <div className="text-left">
                <div className="inline-block p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-full shadow-inner border border-primary/20">
                    <BarChart2 className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                    Programme Reports
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mt-4">
                    An overview of key programme metrics and performance.
                </p>
            </div>
            <div className='flex flex-col gap-2'>
                <Button onClick={() => handleDownload('Full Programme')}><Download className="mr-2 h-4 w-4" /> Export Full Report</Button>
                <Button variant='outline' onClick={() => handleDownload('Attendance')}><Download className="mr-2 h-4 w-4" /> Export Attendance</Button>
            </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="glass-card h-full">
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><Users className='w-5 h-5 text-primary'/> Children Enrolled per Community</CardTitle>
                        <CardDescription>Total number of children registered in each community.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={communityData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Legend content={<ChartLegendContent />} />
                                    <Bar dataKey="children" fill="var(--color-children)" radius={4} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="glass-card h-full">
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><PieChartIcon className='w-5 h-5 text-primary'/> Gender Split</CardTitle>
                        <CardDescription>Breakdown of child participation by gender.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                             <ResponsiveContainer>
                                <PieChart>
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {genderData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={chartConfig[entry.name.toLowerCase() as keyof typeof chartConfig]?.color} />
                                        ))}
                                    </Pie>
                                    <Legend content={<ChartLegendContent />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className='md:col-span-2'>
                <Card className="glass-card h-full">
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><Activity className='w-5 h-5 text-primary'/> Mock Coach Activity</CardTitle>
                        <CardDescription>Total logged activity hours for coaches per month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                             <ResponsiveContainer>
                                <LineChart data={coachActivityData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Legend content={<ChartLegendContent />} />
                                    <Line type="monotone" dataKey="hours" stroke="var(--color-hours)" strokeWidth={3} dot={false} />
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
