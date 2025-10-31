"use client";

import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import EventCard from '@/components/EventCard';
import { useEvents } from '@/context/EventContext';

export default function EventListPage() {
  const { events } = useEvents();

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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">All Events</h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
            Browse through all the exciting Ultimate Frisbee events.
          </p>
        </motion.div>

        <motion.div 
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
