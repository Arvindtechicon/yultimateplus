'use client';

import { motion } from 'framer-motion';
import { LineChart, BarChart as BarChartIcon } from 'lucide-react';
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
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const chartData = [
  { month: 'January', throws: 86, catches: 78, defense: 60 },
  { month: 'February', throws: 88, catches: 82, defense: 65 },
  { month: 'March', throws: 90, catches: 85, defense: 70 },
  { month: 'April', throws: 92, catches: 88, defense: 75 },
  { month: 'May', throws: 95, catches: 92, defense: 80 },
  { month: 'June', throws: 93, catches: 90, defense: 82 },
];

const chartConfig = {
  throws: {
    label: 'Throws',
    color: 'hsl(var(--primary))',
  },
  catches: {
    label: 'Catches',
    color: 'hsl(var(--secondary-foreground))',
  },
  defense: {
    label: 'Defense',
    color: 'hsl(var(--muted-foreground))',
  },
};


export default function PerformancePage() {
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
            <LineChart className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Performance Report
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
            This is where your real-time performance analytics will be displayed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="w-full max-w-4xl mx-auto glass-card">
            <CardHeader>
              <CardTitle>Monthly Performance Metrics</CardTitle>
              <CardDescription>
                A visual breakdown of your performance over the last 6 months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className='h-[400px] w-full'>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegendContent />} />
                        <Bar dataKey="defense" fill="var(--color-defense)" barSize={20} radius={[4, 4, 0, 0]} />
                        <Line type="monotone" dataKey="throws" stroke="var(--color-throws)" strokeWidth={2} />
                        <Line type="monotone" dataKey="catches" stroke="var(--color-catches)" strokeWidth={2} />
                    </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
