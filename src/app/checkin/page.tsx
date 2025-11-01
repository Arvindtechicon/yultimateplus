
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppData } from '@/context/EventContext';
import { mockChildren } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { format } from 'date-fns';

export default function CheckinPage() {
  const { sessions, markSessionAttendance } = useAppData();
  const { toast } = useToast();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // This function simulates scanning a QR code and getting a result (e.g., a child's ID)
  const handleScan = (childId: string) => {
    if (!selectedSessionId) {
        toast({
            variant: "destructive",
            title: "No Session Selected",
            description: "Please select a session before marking attendance.",
        });
        return;
    }

    const child = mockChildren.find(c => c.id === childId);
    const session = sessions.find(s => s.id === selectedSessionId);

    if (child && session) {
        markSessionAttendance(selectedSessionId, childId);
        toast({
            title: "✅ Check-in Successful!",
            description: `${child.name} marked present for session in ${session.community}.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Check-in Failed",
            description: "Could not find the child or session from the scanned QR code.",
        });
    }
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10 flex justify-center items-start pt-12 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md glass-card">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 dark:bg-primary/20 p-4 rounded-full w-fit mb-4">
                <QrCode className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">Session Check-in</CardTitle>
              <CardDescription>
                Select a session and simulate scanning a dummy QR code.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className="space-y-2">
                <Label htmlFor="session-select">1. Select a Session</Label>
                <Select onValueChange={setSelectedSessionId} value={selectedSessionId || ''}>
                    <SelectTrigger id="session-select">
                        <SelectValue placeholder="Choose a session..." />
                    </SelectTrigger>
                    <SelectContent>
                        {sessions.map(session => (
                             <SelectItem key={session.id} value={session.id}>
                                {session.community} - {format(new Date(session.date), "PPP")}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>

              {selectedSessionId && (
                <div className='space-y-4'>
                    <Label>2. Simulate QR Code Scan</Label>
                     <div className='grid grid-cols-1 gap-4'>
                        <Button onClick={() => handleScan('CH001')} disabled={!selectedSessionId}>
                            Simulate Scan for Aarav (QR001)
                        </Button>
                        <Button onClick={() => handleScan('CH002')} disabled={!selectedSessionId}>
                             Simulate Scan for Sneha (QR002)
                        </Button>
                         <Button onClick={() => handleScan('CH003')} disabled={!selectedSessionId}>
                             Simulate Scan for Rohan (QR003)
                        </Button>
                    </div>
                </div>
              )}

              {selectedSession && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className='mt-6'>
                    <Alert>
                        <CheckCircle className="h-5 w-5"/>
                        <AlertTitle>Current Attendance for "{selectedSession.community}"</AlertTitle>
                        <AlertDescription>
                            <p>{selectedSession.participants.length} / {mockChildren.filter(c => c.community === selectedSession.community).length} children present.</p>
                            <ul className='list-disc list-inside mt-2 text-xs'>
                                {selectedSession.participants.map(childId => {
                                    const child = mockChildren.find(c => c.id === childId);
                                    return <li key={childId}>{child?.name}</li>
                                })}
                            </ul>
                        </AlertDescription>
                    </Alert>
                </motion.div>
              )}

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
