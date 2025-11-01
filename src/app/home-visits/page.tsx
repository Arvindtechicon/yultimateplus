'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, PlusCircle } from 'lucide-react';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/EventContext';
import { format } from 'date-fns';
import LogHomeVisitForm from '@/components/dashboard/LogHomeVisitForm';
import type { HomeVisit, Child } from '@/lib/mockData';

export default function HomeVisitsPage() {
  const { children, homeVisits, addHomeVisit } = useApp();
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const handleAddHomeVisit = (data: Omit<HomeVisit, 'id'>) => {
    addHomeVisit({ ...data, id: `HV${Date.now()}` });
    setAddModalOpen(false);
  };
  
  const getChildVisits = (childId: string) => {
    return homeVisits.filter((v) => v.childId === childId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

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
            <Home className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Home Visits
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
            Log and review home visits to stay connected with participants.
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
                <CardTitle>Home Visit Records</CardTitle>
                <CardDescription>
                  Log a new visit or review past visit notes for each child.
                </CardDescription>
              </div>
              <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Log Visit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glass-card">
                  <DialogHeader>
                    <DialogTitle>Log a New Home Visit</DialogTitle>
                  </DialogHeader>
                  <LogHomeVisitForm
                    children={children}
                    onSubmit={handleAddHomeVisit}
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
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Total Visits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {children.map((child) => {
                    const visits = getChildVisits(child.id);
                    const lastVisit = visits[0];
                    return (
                      <TableRow key={child.id}>
                        <TableCell className="font-medium">{child.name}</TableCell>
                        <TableCell>{child.community}</TableCell>
                        <TableCell>
                          {lastVisit ? format(new Date(lastVisit.date), 'PPP') : 'N/A'}
                        </TableCell>
                        <TableCell>{visits.length}</TableCell>
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
