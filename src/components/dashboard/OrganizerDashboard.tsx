
import type { User, Event, Child, HomeVisit } from '@/lib/mockData';
import { organizations, mockSessions, mockChildren } from '@/lib/mockData';
import { StatCard } from './StatCard';
import { Calendar, Users, Building, PlusCircle, Home, QrCode, Percent, BookUser, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import EventCard from '../EventCard';
import { useState, useMemo } from 'react';
import AddEventForm from './AddEventForm';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { useAppData } from '@/context/EventContext';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Textarea } from '../ui/textarea';
import QrScanner from 'react-qr-scanner';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import LogHomeVisitForm from './LogHomeVisitForm';
import { Alert, AlertTitle } from '../ui/alert';


export default function OrganizerDashboard({ user }: { user: User }) {
  const { events, addEvent, addHomeVisit, alerts, markSessionAttendance, venues } = useAppData();
  const [isAddEventOpen, setAddEventOpen] = useState(false);
  const [isAttendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [isHomeVisitModalOpen, setHomeVisitModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  const myOrganizations = organizations.filter(org => org.organizers.includes(user.id));
  const myOrgIds = myOrganizations.map(org => org.id);
  const myEvents = events.filter(event => myOrgIds.includes(event.organizationId));
  const upcomingSessions = mockSessions.filter(s => s.status === 'upcoming' && s.coach === user.name).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3);
  
  const totalParticipants = myEvents.reduce((acc, event) => acc + event.participants.length, 0);

  const attendancePercentage = useMemo(() => {
    const completedSessions = mockSessions.filter(s => s.status === 'completed');
    if(completedSessions.length === 0) return 0;
    const totalAttendance = completedSessions.reduce((acc, session) => acc + session.participants.length, 0);
    const totalPossibleAttendance = completedSessions.reduce((acc, session) => {
        const communityChildrenCount = mockChildren.filter(c => c.community === session.community).length;
        return acc + communityChildrenCount;
    }, 0);
    
    return totalPossibleAttendance > 0 ? (totalAttendance / totalPossibleAttendance) * 100 : 0;
  }, []);

  const handleAddEvent = (newEvent: Omit<Event, 'id' | 'participants'>) => {
    addEvent(newEvent);
    setAddEventOpen(false);
  }

  const handleLogHomeVisit = (data: Omit<HomeVisit, 'id'>) => {
    addHomeVisit(data);
     toast({
        title: "Home Visit Logged",
        description: `Visit for ${mockChildren.find(c => c.id === data.childId)?.name} on ${format(new Date(data.date.toString()), "PPP")} has been logged.`
    })
    setHomeVisitModalOpen(false);
  }

  const handleScan = (data: { text: string } | null) => {
    if(data) {
        setAttendanceModalOpen(false);
        try {
            // In a real app, you'd parse the QR code string. Here we simulate it.
            const childId = data.text; // Assuming QR code just contains the child ID.
            const child = mockChildren.find(c => c.id === childId);
            
            if (child && selectedSessionId) {
                markSessionAttendance(selectedSessionId, childId);
                toast({
                    title: "Attendance Marked!",
                    description: `${child.name} marked present for session ${selectedSessionId}.`
                })
            } else {
                 toast({
                    variant: "destructive",
                    title: "Invalid Scan",
                    description: "Could not find child or session from QR code."
                })
            }
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Scan Error",
                description: "Could not read the QR code."
            })
        }
    }
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
          {alerts.map(a => (
            <Alert key={a.id} variant={a.type}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{a.message}</AlertTitle>
            </Alert>
          ))}
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        >
        <StatCard title="Overall Attendance" value={`${attendancePercentage.toFixed(1)}%`} icon={Percent} description="Across all completed sessions" />
        <StatCard title="Upcoming Sessions" value={upcomingSessions.length} icon={Calendar} description="Your next scheduled sessions" />
        <StatCard title="Total Children" value={mockChildren.length} icon={Users} description="In your communities" />
      </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
            <Card className='glass-card'>
                <CardHeader className='flex-row items-center justify-between'>
                    <div>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>Quick actions for your sessions.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className='grid grid-cols-2 gap-4'>
                    <Dialog open={isAttendanceModalOpen} onOpenChange={setAttendanceModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline"><QrCode className="mr-2 h-4 w-4" />Mark Attendance</Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Mark Attendance</DialogTitle>
                                <DialogDescription>Select a session, then scan a child's QR code to mark them as present.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <Select onValueChange={setSelectedSessionId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a session" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockSessions.filter(s => s.status === 'upcoming').map(session => (
                                            <SelectItem key={session.id} value={session.id}>
                                                {session.community} - {format(new Date(session.date), "PPP")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedSessionId && (
                                    <div className='py-4 rounded-lg overflow-hidden relative w-full aspect-square bg-muted flex items-center justify-center'>
                                        <QrScanner
                                            delay={300}
                                            onError={(e) => console.error(e)}
                                            onScan={handleScan}
                                            className="w-full h-full object-cover"
                                            constraints={{ video: { facingMode: 'environment' } }}
                                        />
                                        <div className="absolute inset-0 border-4 border-primary/50 rounded-lg pointer-events-none"></div>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isHomeVisitModalOpen} onOpenChange={setHomeVisitModalOpen}>
                         <DialogTrigger asChild>
                            <Button variant="outline"><Home className="mr-2 h-4 w-4" />Log Home Visit</Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Log Home Visit</DialogTitle>
                                <DialogDescription>Fill in the details for your home visit.</DialogDescription>
                            </DialogHeader>
                            <LogHomeVisitForm 
                                children={mockChildren}
                                onSubmit={handleLogHomeVisit}
                                onCancel={() => setHomeVisitModalOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <Card className='glass-card'>
                 <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                    <CardDescription>Your next 3 scheduled sessions.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {upcomingSessions.length > 0 ? upcomingSessions.map(session => (
                        <div key={session.id} className='flex items-center justify-between p-3 rounded-lg bg-muted/50'>
                           <div>
                                <p className='font-semibold'>{session.community}</p>
                                <p className='text-sm text-muted-foreground'>{format(new Date(session.date), "eeee, MMM d, yyyy")}</p>
                           </div>
                           <div className='flex items-center gap-2 text-sm'>
                                <Users className='w-4 h-4'/>
                                {session.participants.length}
                           </div>
                        </div>
                    )) : (
                        <p className='text-center text-muted-foreground py-8'>No upcoming sessions.</p>
                    )}
                </CardContent>
            </Card>
        </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card">
          <CardHeader className='flex-row items-center justify-between'>
            <div>
              <CardTitle>Your Organized Events</CardTitle>
              <CardDescription>A list of tournament events you are organizing.</CardDescription>
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
