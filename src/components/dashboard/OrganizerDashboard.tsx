import type { User, Event } from '@/lib/mockData';
import { organizations, venues } from '@/lib/mockData';
import { StatCard } from './StatCard';
import { Calendar, Users, Building, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import EventCard from '../EventCard';
import { useState }from 'react';
import AddEventForm from './AddEventForm';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { useApp } from '@/context/EventContext';

interface OrganizerDashboardProps {
  user: User;
}

export default function OrganizerDashboard({ user }: OrganizerDashboardProps) {
  const { events, addEvent } = useApp();
  const [isAddEventOpen, setAddEventOpen] = useState(false);

  const myOrganizations = organizations.filter(org => org.organizers.includes(user.id));
  const myOrgIds = myOrganizations.map(org => org.id);
  const myEvents = events.filter(event => myOrgIds.includes(event.organizationId));

  const totalParticipants = myEvents.reduce((acc, event) => acc + event.participants.length, 0);

  const handleAddEvent = (newEvent: Omit<Event, 'id' | 'participants'>) => {
    addEvent(newEvent);
    setAddEventOpen(false);
  }

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
        Coach Dashboard
      </motion.h1>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        >
        <StatCard title="Your Events" value={myEvents.length} icon={Calendar} description="Events you are organizing" />
        <StatCard title="Total Participants" value={totalParticipants} icon={Users} description="Across all your events" />
        <StatCard title="Your Organizations" value={myOrganizations.length} icon={Building} description="Organizations you manage" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card">
          <CardHeader className='flex-row items-center justify-between'>
            <div>
              <CardTitle>Your Events</CardTitle>
              <CardDescription>A list of events you are organizing.</CardDescription>
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
                        Fill out the details below to add a new event to your organization.
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
          <CardContent className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {myEvents.length > 0 ? myEvents.map(event => (
              <EventCard event={event} key={event.id} showEditButton />
            )) : (
              <p className="text-muted-foreground text-sm p-4 col-span-full text-center">You are not organizing any events yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
