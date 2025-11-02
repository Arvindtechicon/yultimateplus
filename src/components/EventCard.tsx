
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import {
  Calendar,
  MapPin,
  Building,
  Users,
  QrCode,
  Navigation,
  Edit,
  LogIn,
  LogOut,
  Trophy,
  Eye,
  Award,
} from 'lucide-react';
import type { Event } from '@/lib/mockData';
import { organizations } from '@/lib/mockData';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import QRCodeComponent from 'qrcode.react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/EventContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import EditEventForm from './dashboard/EditEventForm';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import SubmitResultsForm from './dashboard/SubmitResultsForm';
import type { TeamResult } from './dashboard/SubmitResultsForm';

interface EventCardProps {
  event: Event;
  showEditButton?: boolean;
}

export default function EventCard({ event, showEditButton }: EventCardProps) {
  const { user } = useAuth();
  const { toggleEventRegistration, updateEvent, venues, users, teams, updateEventResults } = useAppData();
  const { toast } = useToast();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isResultsDialogOpen, setResultsDialogOpen] = useState(false);
  const router = useRouter();

  const venue = venues.find((v) => v.id === event.venueId);
  const organization = organizations.find((o) => o.id === event.organizationId);
  const participants = users.filter(u => event.participants.includes(u.id));

  const isParticipant = user?.role === 'Participant';
  const isOrganizerOrAdmin = user?.role === 'Organizer' || user?.role === 'Admin';
  const isRegistered = isParticipant && user && event.participants.includes(user.id);
  const myOrganizations = organizations.filter(org => user && org.organizers.includes(user.id));
  const isPastEvent = new Date(event.date) < new Date();

  const qrValue = JSON.stringify({ 
    eventId: event.id, 
    eventName: event.name,
    ...(isParticipant && user && { userId: user.id, userName: user.name })
  });

  const handleRegistration = () => {
    if (user && isParticipant) {
      toggleEventRegistration(event.id, user.id);
      toast({
        title: isRegistered ? "Unregistered" : "Registration Successful!",
        description: isRegistered ? `You have been unregistered from ${event.name}.` : `You are now registered for ${event.name}.`,
      })
    }
  }

  const handleEditEvent = (updatedEvent: Omit<Event, 'id' | 'participants'>) => {
    updateEvent(event.id, updatedEvent);
    toast({
        title: "Event Updated",
        description: `${event.name} has been successfully updated.`,
    });
    setEditDialogOpen(false);
  }

  const handleSubmitResults = (results: { first: TeamResult; second: TeamResult; third: TeamResult; highlights: string }) => {
    updateEventResults(event.id, results);
    toast({
      title: "Results Submitted!",
      description: `Winners and scores for ${event.name} have been updated.`
    });
    setResultsDialogOpen(false);
  };

  const handleDirectionsClick = () => {
    if (venue) {
      router.push(`/map?venueId=${venue.id}`);
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="glass-card flex flex-col h-full overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{event.name}</CardTitle>
            <Badge variant={event.type === 'Tournament' ? 'default' : 'secondary'}>
              {event.type}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-2 pt-1">
            <Building className="w-4 h-4" />
            <span>{organization?.name}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{format(new Date(event.date), 'PPPP p')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{venue?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{event.participants.length} participants</span>
          </div>
          {event.winners && (
             <div className="flex items-start gap-2 pt-2 text-amber-600 dark:text-amber-400">
                <Trophy className="w-4 h-4 mt-0.5" />
                <span className='font-semibold'>1st: {event.winners.first}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-2 pt-4">
          
          {isParticipant ? (
            <>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button 
                            className="w-full"
                            variant={isRegistered ? 'secondary' : 'default'}
                            disabled={isPastEvent}
                            >
                            {isRegistered ? <LogOut className='mr-2' /> : <LogIn className='mr-2' />}
                            {isRegistered ? 'Unregister' : 'Register'}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {isRegistered ? 'Confirm Unregistration' : 'Confirm Registration'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {isRegistered 
                                    ? `Are you sure you want to unregister from "${event.name}"?`
                                    : `You are about to register for "${event.name}". Do you want to proceed?`}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRegistration}>
                                Confirm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

              {isRegistered && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <QrCode className="mr-2 h-4 w-4" />
                        Show QR
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] glass-card">
                      <DialogHeader>
                        <DialogTitle className='text-center'>{event.name}</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center justify-center p-4 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                          <QRCodeComponent value={qrValue} size={256} />
                        </div>
                        <p className="text-xs text-muted-foreground">Scan this to check in</p>
                      </div>
                    </DialogContent>
                  </Dialog>
              )}
            </>
          ) : (
             <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <QrCode className="mr-2 h-4 w-4" />
                  Show QR
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] glass-card">
                <DialogHeader>
                  <DialogTitle className='text-center'>{event.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-4 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeComponent value={qrValue} size={256} />
                  </div>
                  <p className="text-xs text-muted-foreground">Scan this for event details</p>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Button onClick={handleDirectionsClick} className="w-full">
            <Navigation className="mr-2 h-4 w-4" />
            Get Directions
          </Button>
          {showEditButton && (
             <div className='col-span-2 mt-2 grid grid-cols-2 gap-2'>
                <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="secondary" className="w-full">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] glass-card">
                        <DialogHeader>
                            <DialogTitle>Edit Event</DialogTitle>
                            <DialogDescription>
                                Make changes to your event here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <EditEventForm 
                            event={event}
                            organizations={myOrganizations} 
                            onSubmit={handleEditEvent} 
                            onCancel={() => setEditDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
                
                 {isPastEvent && (
                    <Dialog open={isResultsDialogOpen} onOpenChange={setResultsDialogOpen}>
                        <DialogTrigger asChild>
                             <Button variant="outline" className="w-full">
                                <Award className="mr-2 h-4 w-4" />
                                Manage Results
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg glass-card">
                            <DialogHeader>
                                <DialogTitle>Submit Match Results for {event.name}</DialogTitle>
                                <DialogDescription>
                                    Select the winning teams and update their spirit scores.
                                </DialogDescription>
                            </DialogHeader>
                            <SubmitResultsForm 
                                event={event} 
                                teams={teams}
                                onSubmit={handleSubmitResults}
                                onCancel={() => setResultsDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
          )}
          {isOrganizerOrAdmin && (
             <div className='col-span-2 mt-2'>
                <Dialog>
                    <DialogTrigger asChild>
                         <Button variant="outline" className="w-full" disabled={participants.length === 0}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Participants ({participants.length})
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md glass-card">
                        <DialogHeader>
                            <DialogTitle>Participants for {event.name}</DialogTitle>
                            <DialogDescription>
                                {participants.length} {participants.length === 1 ? 'person has' : 'people have'} registered for this event.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-72 my-4">
                            <div className="space-y-4 pr-6">
                                {participants.map(p => (
                                    <div key={p.id} className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${p.name}`} />
                                            <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{p.name}</p>
                                            <p className="text-sm text-muted-foreground">{p.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
