
'use client';

import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/EventContext';
import { BookOpen } from 'lucide-react';
import CoachingCenterCard from '@/components/CoachingCenterCard';

export default function CoachingPage() {
  const { coachingCenters } = useApp();

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
          className="text-center mb-12"
        >
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                <BookOpen className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Coaching Centers
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
            Find and enroll in coaching centers to improve your skills.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {coachingCenters.map((center) => (
            <CoachingCenterCard key={center.id} center={center} />
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
