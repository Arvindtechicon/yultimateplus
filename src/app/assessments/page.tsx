'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, PlusCircle, Eye } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppData } from '@/context/EventContext';
import AddAssessmentForm from '@/components/dashboard/AddAssessmentForm';
import ViewAssessmentProgress from '@/components/dashboard/ViewAssessmentProgress';
import type { Assessment, Child } from '@/lib/mockData';

export default function AssessmentsPage() {
  const { children, assessments, addAssessment } = useAppData();
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const handleAddAssessment = (data: Omit<Assessment, 'date'>) => {
    addAssessment({ ...data, date: new Date().toISOString() });
    setAddModalOpen(false);
  };

  const getChildAssessments = (childId: string) => {
    return assessments.filter((a) => a.childId === childId);
  };

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
            Track and manage child assessments for key life skills.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="w-full max-w-4xl mx-auto glass-card">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Child Assessment Records</CardTitle>
                <CardDescription>
                  Log new assessments or view progress for each child.
                </CardDescription>
              </div>
              <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glass-card">
                  <DialogHeader>
                    <DialogTitle>Log New Assessment</DialogTitle>
                  </DialogHeader>
                  <AddAssessmentForm
                    children={children}
                    onSubmit={handleAddAssessment}
                    onCancel={() => setAddModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Child Name</TableHead>
                    <TableHead>Community</TableHead>
                    <TableHead>Assessments</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {children.map((child) => {
                    const childAssessments = getChildAssessments(child.id);
                    const hasBaseline = childAssessments.some(a => a.type === 'Baseline');
                    const hasEndline = childAssessments.some(a => a.type === 'Endline');

                    return (
                        <TableRow key={child.id}>
                            <TableCell className="font-medium">{child.name}</TableCell>
                            <TableCell>{child.community}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                {hasBaseline && <Badge variant='secondary'>Baseline</Badge>}
                                {hasEndline && <Badge>Endline</Badge>}
                                {!hasBaseline && !hasEndline && <Badge variant='outline'>None</Badge>}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" disabled={childAssessments.length === 0}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Progress
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md glass-card">
                                        <DialogHeader>
                                            <DialogTitle>Assessment Progress for {child.name}</DialogTitle>
                                        </DialogHeader>
                                        <ViewAssessmentProgress assessments={childAssessments} />
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
