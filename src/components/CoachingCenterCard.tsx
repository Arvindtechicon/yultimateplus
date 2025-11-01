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
import { MapPin, Users, LogIn, LogOut } from 'lucide-react';
import type { CoachingCenter } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/EventContext';
import { useToast } from '@/hooks/use-toast';

interface CoachingCenterCardProps {
  center: CoachingCenter;
}

export default function CoachingCenterCard({ center }: CoachingCenterCardProps) {
  const { user } = useAuth();
  const { toggleCoachingCenterRegistration } = useApp();
  const { toast } = useToast();

  const isParticipant = user?.role === 'Participant';
  const isRegistered = isParticipant && user && center.participants.includes(user.id);

  const handleRegistration = () => {
    if (user && isParticipant) {
      toggleCoachingCenterRegistration(center.id, user.id);
      toast({
        title: isRegistered ? "Unregistered" : "Enrollment Successful!",
        description: isRegistered
          ? `You have been unenrolled from ${center.name}.`
          : `You are now enrolled in ${center.name}.`,
      });
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
          <CardTitle className="text-xl font-bold">{center.name}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-1">
             <Badge variant="secondary">{center.specialty}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{center.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{center.participants.length} participants</span>
          </div>
        </CardContent>
        {isParticipant && (
          <CardFooter className="pt-4">
            <Button
              onClick={handleRegistration}
              className="w-full"
              variant={isRegistered ? 'secondary' : 'default'}
            >
              {isRegistered ? <LogOut className='mr-2 h-4 w-4' /> : <LogIn className='mr-2 h-4 w-4' />}
              {isRegistered ? 'Unenroll' : 'Enroll Now'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
