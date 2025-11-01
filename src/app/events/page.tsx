"use client";

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import EventCard from '@/components/EventCard';
import { useApp } from '@/context/EventContext';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { venues } from '@/lib/mockData';

export default function EventListPage() {
  const { events } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (dateFilter === 'upcoming') {
      filtered = filtered.filter((event) => new Date(event.date) >= new Date());
    } else if (dateFilter === 'past') {
      filtered = filtered.filter((event) => new Date(event.date) < new Date());
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((event) => {
        const venue = venues.find((v) => v.id === event.venueId);
        return (
          event.name.toLowerCase().includes(lowercasedQuery) ||
          event.description.toLowerCase().includes(lowercasedQuery) ||
          event.type.toLowerCase().includes(lowercasedQuery) ||
          venue?.name.toLowerCase().includes(lowercasedQuery)
        );
      });
    }

    return filtered;
  }, [events, searchQuery, dateFilter]);

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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            All Events
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
            Browse through all the exciting Ultimate Frisbee events.
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
                    placeholder="Search events by name, type, venue..."
                    className="pl-10 h-11"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-[180px] h-11">
                    <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                </SelectContent>
            </Select>
        </motion.div>


        <motion.div
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
                <p className='text-lg font-medium'>No Events Found</p>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filter settings.</p>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
