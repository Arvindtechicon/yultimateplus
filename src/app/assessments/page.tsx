'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, Brain, Star, Zap, TrendingUp } from 'lucide-react';
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
} from '@/components/ui/chart';
import {
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const chartData = [
  { category: 'Learning', score: 8.5, fullMark: 10 },
  { category: 'Skill', score: 9.2, fullMark: 10 },
  { category: 'Athleticism', score: 7.8, fullMark: 10 },
  { category: 'Strategy', score: 8.1, fullMark: 10 },
  { category: 'Teamwork', score: 9.5, fullMark: 10 },
];

const chartConfig = {
    score: {
        label: 'Score',
        color: 'hsl(var(--primary))',
    },
};

export default function AssessmentsPage() {
  const overallScore = (chartData.reduce((acc, item) => acc + item.score, 0) / (chartData.length * 10)) * 100;

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
            <ClipboardCheck className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            LSAS Assessments
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
            View and manage your real-time LSAS (Learning, Skill, and Athleticism Score) assessments.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="w-full max-w-4xl mx-auto glass-card">
            <CardHeader>
              <CardTitle>Latest Assessment: Q2 2024</CardTitle>
              <CardDescription>
                Your LSAS score and category breakdown.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Overall LSAS Score</h3>
                            <Badge className='text-lg' variant='default'>{overallScore.toFixed(1)}</Badge>
                        </div>
                        <Progress value={overallScore} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-1">This score represents your holistic performance.</p>
                    </div>

                    <div className='space-y-4'>
                        <div className="flex items-center gap-4">
                            <Brain className="w-6 h-6 text-primary" />
                            <div>
                                <p className='font-medium'>Learning</p>
                                <p className='text-sm text-muted-foreground'>Grasp of new concepts and strategies.</p>
                            </div>
                            <p className="ml-auto font-bold text-lg">{chartData.find(d => d.category === 'Learning')?.score}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Star className="w-6 h-6 text-primary" />
                            <div>
                                <p className='font-medium'>Skill</p>
                                <p className='text-sm text-muted-foreground'>Execution of throws, catches, and defense.</p>
                            </div>
                            <p className="ml-auto font-bold text-lg">{chartData.find(d => d.category === 'Skill')?.score}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Zap className="w-6 h-6 text-primary" />
                            <div>
                                <p className='font-medium'>Athleticism</p>
                                <p className='text-sm text-muted-foreground'>Speed, agility, and endurance.</p>
                            </div>
                            <p className="ml-auto font-bold text-lg">{chartData.find(d => d.category === 'Athleticism')?.score}</p>
                        </div>
                    </div>

                </div>
                <div className="min-h-[300px]">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={chartData}>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <PolarAngleAxis dataKey="category" />
                            <PolarGrid />
                            <Radar
                            dataKey="score"
                            fill="var(--color-score)"
                            fillOpacity={0.6}
                            stroke="var(--color-score)"
                            />
                        </RadarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}