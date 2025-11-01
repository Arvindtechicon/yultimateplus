'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import CoachingCenterCard from '@/components/CoachingCenterCard';
import { useAppData } from '@/context/EventContext';
import { BookOpen, PlusCircle, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddCoachingCenterForm from '@/components/dashboard/AddCoachingCenterForm';
import type { CoachingCenter } from '@/lib/mockData';

export default function CoachingPage() {
  const { user } = useAuth();
  const { coachingCenters, addCoachingCenter } = useAppData();
  const [isAddCenterOpen, setAddCenterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const canAddCenter = user?.role === 'Admin' || user?.role === 'Organizer';

  const filteredCoachingCenters = useMemo(() => {
    let filtered = coachingCenters;

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (center) =>
          center.name.toLowerCase().includes(lowercasedQuery) ||
          center.specialty.toLowerCase().includes(lowercasedQuery) ||
          center.location.toLowerCase().includes(lowercasedQuery)
      );
    }
    return filtered;
  }, [coachingCenters, searchQuery]);
  
  const handleAddCenter = (newCenter: Omit<CoachingCenter, 'id' | 'participants'>) => {
    addCoachingCenter(newCenter);
    setAddCenterOpen(false);
  };

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
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <BookOpen className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Coaching Centers
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
            Find and enroll in coaching programs to elevate your game.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto"
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialty, location..."
              className="pl-10 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {canAddCenter && (
             <Dialog open={isAddCenterOpen} onOpenChange={setAddCenterOpen}>
                <DialogTrigger asChild>
                  <Button className='h-11'>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Center
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glass-card">
                  <DialogHeader>
                    <DialogTitle>Create a New Coaching Center</DialogTitle>
                    <DialogDescription>
                      Fill out the details for the new coaching center.
                    </DialogDescription>
                  </DialogHeader>
                  <AddCoachingCenterForm
                    onSubmit={handleAddCenter}
                    onCancel={() => setAddCenterOpen(false)}
                  />
                </DialogContent>
              </Dialog>
          )}
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredCoachingCenters.map((center) => (
            <CoachingCenterCard key={center.id} center={center} />
          ))}
        </motion.div>
        {filteredCoachingCenters.length === 0 && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 col-span-full">
                <p className='text-lg font-medium'>No Coaching Centers Found</p>
                <p className="text-muted-foreground mt-2">Try adjusting your search terms.</p>
            </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
