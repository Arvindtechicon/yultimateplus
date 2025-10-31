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
} from 'lucide-react';
import type { Event } from '@/lib/mockData';
import { venues, organizations } from '@/lib/mockData';
import { format } from 'date-fns';
import Link from 'next/link';
import QRCodeComponent from 'qrcode.react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { useToast } from '@/hooks/use-toast';

interface EventCardProps {
  event: Event;
  showEditButton?: boolean;
}

export default function EventCard({ event, showEditButton }: EventCardProps) {
  const { user } = useAuth();
  const { toggleRegistration } = useEvents();
  const { toast } = useToast();

  const venue = venues.find((v) => v.id === event.venueId);
  const organization = organizations.find((o) => o.id === event.organizationId);
  const qrValue = JSON.stringify({ eventId: event.id, eventName: event.name });
  
  const isParticipant = user?.role === 'Participant';
  const isRegistered = isParticipant && event.participants.includes(user.id);

  const handleRegistration = () => {
    if (user) {
      toggleRegistration(event.id, user.id);
      toast({
        title: isRegistered ? "Unregistered" : "Registration Successful!",
        description: isRegistered ? `You have been unregistered from ${event.name}.` : `You are now registered for ${event.name}.`,
      })
    }
  }

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
                  <p className="text-xs text-muted-foreground">Scan this to check in</p>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Link href={`/map?venueId=${event.venueId}`} passHref>
            <Button className="w-full col-start-2">
              <Navigation className="mr-2 h-4 w-4" />
              Get Directions
            </Button>
          </Link>
          {showEditButton && (
             <div className='col-span-2 mt-2'>
                <Button variant="secondary" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Event
                </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
