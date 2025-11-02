
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
} from 'lucide-react';
import type { Event } from '@/lib/mockData';
import { organizations, users } from '@/lib/mockData';
import { format } from 'date-fns';
import Link from 'next/link';
import QRCodeComponent from 'qrcode.react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/EventContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import EditEventForm from './dashboard/EditEventForm';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

interface EventCardProps {
  event: Event;
  showEditButton?: boolean;
}

export default function EventCard({ event, showEditButton }: EventCardProps) {
  const { user } = useAuth();
  const { toggleEventRegistration, updateEvent, venues } = useAppData();
  const { toast } = useToast();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

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

  const handleDirectionsClick = () => {
    if (venue) {
      const url = `https://www.google.com/maps/search/?api=1&query=${venue.coordinates.lat},${venue.coordinates.lng}`;
      window.open(url, '_blank');
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
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-2 pt-4">
          
          {isParticipant ? (
            <>
              <Button 
                onClick={handleRegistration} 
                className="w-full"
                variant={isRegistered ? 'secondary' : 'default'}
                disabled={isPastEvent}
                >
                {isRegistered ? <LogOut className='mr-2' /> : <LogIn className='mr-2' />}
                {isRegistered ? 'Unregister' : 'Register'}
              </Button>

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
                {isPastEvent && event.winners && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Trophy className="mr-2 h-4 w-4" />
                        View Winners
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm glass-card">
                      <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                          <Trophy className="w-6 h-6 text-primary" />
                          Winners: {event.name}
                        </DialogTitle>
                        <DialogDescription>
                          Congratulations to the winners of the event!
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                          <div className='flex items-center gap-4 p-3 rounded-lg bg-yellow-400/20 dark:bg-yellow-400/10'>
                            <div className='p-2 bg-yellow-500 rounded-full text-white'>
                              <Trophy className='w-5 h-5'/>
                            </div>
                            <div>
                              <p className='text-xs font-semibold text-yellow-600 dark:text-yellow-400'>1st Place</p>
                              <p className='font-bold text-lg text-yellow-800 dark:text-yellow-200'>{event.winners.first}</p>
                            </div>
                          </div>
                           <div className='flex items-center gap-4 p-3 rounded-lg bg-gray-400/20 dark:bg-gray-400/10'>
                            <div className='p-2 bg-gray-500 rounded-full text-white'>
                              <Trophy className='w-5 h-5'/>
                            </div>
                            <div>
                              <p className='text-xs font-semibold text-gray-600 dark:text-gray-400'>2nd Place</p>
                              <p className='font-bold text-lg text-gray-800 dark:text-gray-300'>{event.winners.second}</p>
                            </div>
                          </div>
                           <div className='flex items-center gap-4 p-3 rounded-lg bg-orange-400/20 dark:bg-orange-400/10'>
                            <div className='p-2 bg-orange-500 rounded-full text-white'>
                              <Trophy className='w-5 h-5'/>
                            </div>
                            <div>
                              <p className='text-xs font-semibold text-orange-600 dark:text-orange-400'>3rd Place</p>
                              <p className='font-bold text-lg text-orange-800 dark:text-orange-200'>{event.winners.third}</p>
                            </div>
                          </div>
                      </div>
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
