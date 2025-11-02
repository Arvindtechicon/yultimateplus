
'use client';

import { useParams } from 'next/navigation';
import { useAppData } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Users, BookOpen, LogIn, LogOut, ArrowLeft, Info, IndianRupee, Calendar } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function CoachingCenterDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { coachingCenters, toggleCoachingCenterRegistration, users } = useAppData();
  const { user } = useAuth();
  const { toast } = useToast();

  const centerId = parseInt(id as string);
  const center = coachingCenters.find((c) => c.id === centerId);

  if (!center) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Coaching Center Not Found</h1>
          <p className="text-muted-foreground">
            The center you are looking for does not exist.
          </p>
           <Button asChild variant="link" className="mt-4">
            <Link href="/coaching">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Coaching Centers
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const participants = users.filter(u => center.participants.includes(u.id));
  const isParticipant = user?.role === 'Participant';
  const isRegistered = isParticipant && user && center.participants.includes(user.id);
  
  const handleRegistration = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user && isParticipant) {
      toggleCoachingCenterRegistration(center.id, user.id);
      toast({
        title: isRegistered ? 'Unregistered' : 'Enrollment Successful!',
        description: isRegistered
          ? `You have been unenrolled from ${center.name}.`
          : `You are now enrolled in ${center.name}.`,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
            <Button asChild variant="ghost" className="mb-8">
                <Link href="/coaching">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all centers
                </Link>
            </Button>

          <div className="grid md:grid-cols-5 gap-8">
            <motion.div 
                className="md:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden glass-card">
                <div className="relative w-full aspect-video">
                  <Image
                    src={`https://picsum.photos/seed/${center.id}/600/400`}
                    alt={center.name}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="sports coaching"
                  />
                </div>
                 <CardHeader>
                    <CardTitle className="text-3xl font-bold">{center.name}</CardTitle>
                    <CardDescription>
                        <Badge variant="secondary">{center.specialty}</Badge>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-5 h-5" />
                        <span>{center.location}</span>
                    </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div 
                className="md:col-span-3 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className='glass-card'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><Info />About this program</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{center.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className='flex items-center gap-2'>
                                <IndianRupee className='w-5 h-5 text-primary' />
                                <div>
                                    <p className='font-semibold'>Fee</p>
                                    <p className='text-muted-foreground'>₹{center.fee ? center.fee.toLocaleString() : 'N/A'}</p>
                                </div>
                            </div>
                             <div className='flex items-center gap-2'>
                                <Calendar className='w-5 h-5 text-primary' />
                                <div>
                                    <p className='font-semibold'>Schedule</p>
                                    <p className='text-muted-foreground'>{center.schedule}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

              <Card className='glass-card'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Users />Participants ({participants.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                      {participants.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {participants.map(p => (
                                <div key={p.id} className="flex flex-col items-center text-center gap-2">
                                    <Avatar>
                                        <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${p.name}`} />
                                        <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-medium truncate w-full">{p.name}</span>
                                </div>
                            ))}
                        </div>
                      ) : (
                        <p className='text-sm text-muted-foreground'>No participants enrolled yet.</p>
                      )}
                  </CardContent>
              </Card>
               {isParticipant && (
                 <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><BookOpen />Enrollment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-muted-foreground mb-4'>
                            {isRegistered ? "You are currently enrolled in this program." : "Join this program to improve your skills."}
                        </p>
                        <Button
                            onClick={handleRegistration}
                            className="w-full"
                            variant={isRegistered ? 'secondary' : 'default'}
                        >
                            {isRegistered ? <LogOut className='mr-2 h-4 w-4' /> : <LogIn className='mr-2 h-4 w-4' />}
                            {isRegistered ? 'Unenroll' : 'Enroll Now'}
                        </Button>
                    </CardContent>
                 </Card>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
