"use client";

import { useMemo } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PolarGrid, PolarAngleAxis, Radar, RadarChart, ResponsiveContainer, Legend } from 'recharts';
import type { Assessment } from '@/lib/mockData';

interface ViewAssessmentProgressProps {
  assessments: Assessment[];
}

const chartConfig = {
  baseline: { label: 'Baseline', color: 'hsl(var(--muted-foreground))' },
  endline: { label: 'Endline', color: 'hsl(var(--primary))' },
};

export default function ViewAssessmentProgress({ assessments }: ViewAssessmentProgressProps) {
  const baseline = assessments.find((a) => a.type === 'Baseline');
  const endline = assessments.find((a) => a.type === 'Endline');

  const assessmentData = useMemo(() => {
    const categories = ['teamwork', 'confidence', 'communication'];
    return categories.map((category) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      baseline: baseline?.score[category as keyof typeof baseline.score] || 0,
      endline: endline?.score[category as keyof typeof endline.score] || 0,
    }));
  }, [baseline, endline]);

  return (
    <div className="py-4">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <ResponsiveContainer>
          <RadarChart data={assessmentData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="category" />
            <PolarGrid />
            {baseline && (
              <Radar
                name="Baseline"
                dataKey="baseline"
                stroke="var(--color-baseline)"
                fill="var(--color-baseline)"
                fillOpacity={0.6}
              />
            )}
            {endline && (
              <Radar
                name="Endline"
                dataKey="endline"
                stroke="var(--color-endline)"
                fill="var(--color-endline)"
                fillOpacity={0.6}
              />
            )}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
