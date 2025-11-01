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
import { CheckCircle, XCircle, QrCode, VideoOff, User, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { useEvents } from '@/context/EventContext';
import type { Event } from '@/lib/mockData';
import QrScanner from 'react-qr-scanner';
import { useToast } from '@/hooks/use-toast';

interface CheckedInData {
    event: Event;
    userName?: string;
}

export default function CheckinPage() {
  const { events } = useEvents();
  const [checkinStatus, setCheckinStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [checkedInData, setCheckedInData] = useState<CheckedInData | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [isScanning, setIsScanning] = useState(true);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);


  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);


  const handleScan = (data: { text: string } | null) => {
    if (data?.text && isScanning) {
      setIsScanning(false); // Stop scanning once a code is found
      handleCheckIn(data.text);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError' || err?.name === "NotFoundError") {
        setHasCameraPermission(false);
    }
  };

  const handleCheckIn = (qrValue: string) => {
    setCheckinStatus('idle');
    setCheckedInData(null);

    if (!qrValue || !qrValue.trim()) {
      setCheckinStatus('error');
      setTimeout(() => setIsScanning(true), 3000); // Allow scanning again after a delay
      return;
    }

    let foundEvent: Event | undefined;
    let userName: string | undefined;

    try {
      const parsedQr = JSON.parse(qrValue);
      const eventId = parsedQr.eventId;
      userName = parsedQr.userName;
      foundEvent = events.find((event) => event.id === eventId);
    } catch (error) {
      // Fallback for non-JSON QR codes (e.g., just an event ID)
      const eventId = parseInt(qrValue, 10);
      if (!isNaN(eventId)) {
        foundEvent = events.find((e) => e.id === eventId);
      }
    }

    if (foundEvent) {
      setCheckinStatus('success');
      setCheckedInData({ event: foundEvent, userName });
    } else {
      setCheckinStatus('error');
    }
    
    // Reset scanner after a delay
    setTimeout(() => {
        setCheckinStatus('idle');
        setCheckedInData(null);
        setIsScanning(true);
    }, 3000);
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
                  {isScanning && hasCameraPermission && (
                    <QrScanner
                      delay={300}
                      onError={handleError}
                      onScan={handleScan}
                      className="w-full h-full object-cover"
                      constraints={{ video: { facingMode: 'environment' } }}
                    />
                  )}
                  {!hasCameraPermission && (
                    <div className='text-center text-muted-foreground p-4'>
                        <VideoOff className='w-12 h-12 mx-auto mb-2'/>
                        <p>Camera access is required.</p>
                        <p className='text-xs'>Please grant permission in your browser.</p>
                    </div>
                  )}
                  <div className="absolute inset-0 border-4 border-primary/50 rounded-lg pointer-events-none"></div>
                </div>
              </div>

              <AnimatePresence>
                {checkinStatus !== 'idle' && (
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
                    {checkinStatus === 'success' && checkedInData ? (
                      <Alert
                        variant="default"
                        className="bg-green-50/50 dark:bg-green-900/30 border-green-500/30"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <AlertTitle className="text-green-800 dark:text-green-300 font-bold text-lg">
                          Check-in Successful!
                        </AlertTitle>
                        <AlertDescription className="text-green-700 dark:text-green-400 space-y-1">
                          <p>Event: <strong>{checkedInData.event.name}</strong></p>
                          {checkedInData.userName && (
                              <div className='flex items-center gap-2 pt-1'>
                                  <User className='h-4 w-4'/>
                                  <span>Participant: <strong>{checkedInData.userName}</strong></span>
                              </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <XCircle className="h-5 w-5" />
                        <AlertTitle className="font-bold text-lg">
                          Check-in Failed
                        </AlertTitle>
                        <AlertDescription>
                          Invalid or unrecognized QR code. Please try again.
                        </AlertDescription>
                      </Alert>
                    )}
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
