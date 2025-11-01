'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, QrCode, VideoOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { useEvents } from '@/context/EventContext';
import type { Event } from '@/lib/mockData';
import QrScanner from 'react-qr-scanner';
import { useToast } from '@/hooks/use-toast';

export default function CheckinPage() {
  const { events } = useEvents();
  const [checkinStatus, setCheckinStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [checkedInEvent, setCheckedInEvent] = useState<Event | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [isScanning, setIsScanning] = useState(true);
  const { toast } = useToast();

  const handleScan = (data: { text: string } | null) => {
    if (data && isScanning) {
      setIsScanning(false); // Stop scanning once a code is found
      handleCheckIn(data.text);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setHasCameraPermission(false);
        toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
        });
    }
  };

  const handleCheckIn = (qrValue: string) => {
    setCheckinStatus('idle');
    setCheckedInEvent(null);

    if (!qrValue.trim()) {
      setCheckinStatus('error');
      setIsScanning(true); // Allow scanning again
      return;
    }

    let foundEvent: Event | undefined;

    // Try parsing as JSON first
    try {
      const parsedQr = JSON.parse(qrValue);
      const eventId = parsedQr.eventId;

      foundEvent = events.find((event) => event.id === eventId);
    } catch (error) {
      // If JSON parsing fails, try treating it as a simple ID
      const eventId = parseInt(qrValue, 10);
      if (!isNaN(eventId)) {
        foundEvent = events.find((e) => e.id === eventId);
      }
    }

    if (foundEvent) {
      setCheckinStatus('success');
      setCheckedInEvent(foundEvent);
    } else {
      setCheckinStatus('error');
    }
    
    // Resume scanning after a delay
    setTimeout(() => setIsScanning(true), 3000);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

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
              <CardTitle className="text-3xl font-bold">Event Check-in</CardTitle>
              <CardDescription>
                Scan a participant's QR code to mark their attendance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden relative w-full aspect-video bg-muted flex items-center justify-center">
                  {hasCameraPermission ? (
                    <QrScanner
                      delay={300}
                      onError={handleError}
                      onScan={handleScan}
                      className="w-full h-full object-cover"
                      constraints={{ video: { facingMode: 'environment' } }}
                    />
                  ) : (
                    <div className='text-center text-muted-foreground p-4'>
                        <VideoOff className='w-12 h-12 mx-auto mb-2'/>
                        <p>Camera access is required to scan QR codes.</p>
                    </div>
                  )}
                  <div className="absolute inset-0 border-4 border-primary/50 rounded-lg pointer-events-none"></div>
                </div>
              </div>

              <AnimatePresence>
                {checkinStatus === 'success' && checkedInEvent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="mt-6"
                  >
                    <Alert
                      variant="default"
                      className="bg-green-50/50 dark:bg-green-900/30 border-green-500/30"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <AlertTitle className="text-green-800 dark:text-green-300 font-bold text-lg">
                        Check-in Successful!
                      </AlertTitle>
                      <AlertDescription className="text-green-700 dark:text-green-400">
                        Welcome to <strong>{checkedInEvent.name}</strong>.
                        Enjoy the event!
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {checkinStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="mt-6"
                  >
                    <Alert variant="destructive">
                      <XCircle className="h-5 w-5" />
                      <AlertTitle className="font-bold text-lg">
                        Check-in Failed
                      </AlertTitle>
                      <AlertDescription>
                        Invalid or unrecognized event QR code. Please try again.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
