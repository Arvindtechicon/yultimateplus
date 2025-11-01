'use client';

import { useState } from 'react';
import type { User, Event } from '@/lib/mockData';
import { organizations, venues } from '@/lib/mockData';
import { PlusCircle, Trophy } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import EventCard from '@/components/EventCard';
import AddEventForm from '@/components/dashboard/AddEventForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useApp } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';

export default function MyEventsPage() {
  const { user } = useAuth();
  const { events, addEvent } = useApp();
  const [isAddEventOpen, setAddEventOpen] = useState(false);

  // Ensure user is defined and is an Organizer before proceeding
  if (!user || user.role !== 'Organizer') {
    // You can return a loading state or a message, or redirect
    return (
        <DashboardLayout>
            <div className="p-8 text-center">
                <p>You must be an organizer to view this page.</p>
            </div>
      </DashboardLayout>
    );
  }

  const myOrganizations = organizations.filter((org) =>
    org.organizers.includes(user.id)
  );
  const myOrgIds = myOrganizations.map((org) => org.id);
  const myEvents = events.filter((event) =>
    myOrgIds.includes(event.organizationId)
  );

  const handleAddEvent = (newEvent: Omit<Event, 'id' | 'participants'>) => {
    addEvent(newEvent);
    setAddEventOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
            <div className="inline-block p-3 bg-primary/10 rounded-lg">
                <Trophy className="w-8 h-8 text-primary" />
            </div>
          <div>
            <h1 className="text-3xl font-bold">My Events</h1>
            <p className="text-muted-foreground">Manage all the events you are organizing.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Your Organized Events ({myEvents.length})</CardTitle>
                <CardDescription>
                  A list of events you are organizing.
                </CardDescription>
              </div>
              <Dialog open={isAddEventOpen} onOpenChange={setAddEventOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glass-card">
                  <DialogHeader>
                    <DialogTitle>Create a New Event</DialogTitle>
                    <DialogDescription>
                      Fill out the details below to add a new event to your
                      organization.
                    </DialogDescription>
                  </DialogHeader>
                  <AddEventForm
                    organizations={myOrganizations}
                    venues={venues}
                    onSubmit={handleAddEvent}
                    onCancel={() => setAddEventOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {myEvents.length > 0 ? (
                myEvents.map((event) => (
                  <EventCard event={event} key={event.id} showEditButton />
                ))
              ) : (
                <p className="text-muted-foreground text-sm p-4 col-span-full text-center">
                  You are not organizing any events yet. Click "Add Event" to
                  get started.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
