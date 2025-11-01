'use client';

import type { User } from '@/lib/mockData';
import { venues } from '@/lib/mockData';
import { CalendarCheck, Search, Trophy, X, BookOpen } from 'lucide-react';
import { StatCard } from './StatCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useApp } from '@/context/EventContext';
import { useMemo, useState } from 'react';
import { Input } from '../ui/input';
import EventCard from '../EventCard';

interface ParticipantDashboardProps {
  user: User;
}

export default function ParticipantDashboard({
  user,
}: ParticipantDashboardProps) {
  const { events, coachingCenters } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const registeredEvents = events.filter((event) =>
    event.participants.includes(user.id)
  );
  const upcomingEvents = registeredEvents
    .filter((event) => new Date(event.date) >= new Date())
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  const pastEvents = registeredEvents
    .filter((event) => new Date(event.date) < new Date())
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  const enrolledCoachingCenters = coachingCenters.filter((center) => 
    center.participants.includes(user.id)
  );

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venues
          .find((v) => v.id === event.venueId)
          ?.name.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, events]);

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
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        Welcome, {user.name.split(' ')[0]}!
      </motion.h1>
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          title="Upcoming Events"
          value={upcomingEvents.length}
          icon={CalendarCheck}
          description="Events you're registered for"
        />
        <StatCard
          title="Past Events"
          value={pastEvents.length}
          icon={Trophy}
          description="Events you've attended"
        />
        <StatCard
          title="Coaching Enrollments"
          value={enrolledCoachingCenters.length}
          icon={BookOpen}
          description="Your current coaching programs"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Find an Event</CardTitle>
            <CardDescription>
              Search for tournaments, workshops, and meetups.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by event name, type, or venue..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {searchQuery && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Search Results ({searchResults.length})
                </h3>
                {searchResults.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {searchResults.map((event) => (
                      <EventCard event={event} key={event.id} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No events found matching your search.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="glass-card">
            <CardHeader>
                <CardTitle>
                Your Registered Events ({registeredEvents.length})
                </CardTitle>
                <CardDescription>
                All your upcoming and past events at a glance.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                <h3 className="text-lg font-semibold mb-4">Upcoming</h3>
                {upcomingEvents.length > 0 ? (
                    <div className="grid gap-4">
                    {upcomingEvents.map((event) => {
                        const venue = venues.find((v) => v.id === event.venueId);
                        return (
                        <div
                            key={event.id}
                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex justify-between items-start gap-4">
                            <div>
                                <p className="font-semibold">{event.name}</p>
                                <p className="text-sm text-muted-foreground">
                                {format(new Date(event.date), 'PPPP p')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                {venue?.name} - {venue?.location}
                                </p>
                            </div>
                            <div className="text-right">
                                <Badge
                                variant={
                                    event.type === 'Tournament'
                                    ? 'default'
                                    : 'secondary'
                                }
                                >
                                {event.type}
                                </Badge>
                                <p className="text-xs text-primary mt-1">
                                Starts{' '}
                                {formatDistanceToNow(new Date(event.date), {
                                    addSuffix: true,
                                })}
                                </p>
                            </div>
                            </div>
                            <div className="flex justify-end mt-4">
                            <Link href={`/map?venueId=${event.venueId}`} passHref>
                                <Button size="sm" variant="outline">
                                View on Map
                                </Button>
                            </Link>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                        You are not registered for any upcoming events.
                    </p>
                    <Link href="/events" passHref>
                        <Button variant="link" className="mt-2">
                        Browse Events
                        </Button>
                    </Link>
                    </div>
                )}
                </div>

                <Separator />

                <div>
                <h3 className="text-lg font-semibold mb-4">Past</h3>
                {pastEvents.length > 0 ? (
                    <div className="grid gap-4">
                    {pastEvents.map((event) => (
                        <div
                        key={event.id}
                        className="p-4 border rounded-lg opacity-70"
                        >
                        <div className="flex justify-between items-start">
                            <div>
                            <p className="font-semibold">{event.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(event.date), 'MMMM d, yyyy')}
                            </p>
                            </div>
                            <Badge variant="outline">{event.type}</Badge>
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                    You haven't attended any events yet.
                    </p>
                )}
                </div>
            </CardContent>
            </Card>
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle>Your Coaching Enrollments</CardTitle>
              <CardDescription>
                Your currently enrolled coaching programs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enrolledCoachingCenters.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCoachingCenters.map(center => (
                    <div key={center.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <p className="font-semibold">{center.name}</p>
                      <p className="text-sm text-muted-foreground">{center.specialty}</p>
                      <p className="text-xs text-muted-foreground mt-1">{center.location}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    You are not enrolled in any coaching centers.
                  </p>
                  <Link href="/coaching" passHref>
                    <Button variant="link" className="mt-2">
                      Browse Coaching Centers
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
