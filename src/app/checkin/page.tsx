"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, QrCode } from 'lucide-react';
import { events } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';

export default function CheckinPage() {
  const [qrValue, setQrValue] = useState('');
  const [checkinStatus, setCheckinStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [checkedInEvent, setCheckedInEvent] = useState<string | null>(null);

  const handleCheckIn = () => {
    setCheckinStatus('idle');
    setCheckedInEvent(null);

    if (!qrValue.trim()) {
      setCheckinStatus('error');
      return;
    }

    try {
      const parsedQr = JSON.parse(qrValue);
      const eventId = parsedQr.eventId;
      
      const event = events.find(event => event.id === eventId);

      if (event) {
        setCheckinStatus('success');
        setCheckedInEvent(event.name);
      } else {
        setCheckinStatus('error');
      }
    } catch (error) {
      const eventId = parseInt(qrValue, 10);
      if (!isNaN(eventId) && events.some(event => event.id === eventId)) {
        const event = events.find(e => e.id === eventId);
        setCheckinStatus('success');
        setCheckedInEvent(event?.name || `Event ID: ${eventId}`);
      } else {
         setCheckinStatus('error');
      }
    }
  };

  return (
    <DashboardLayout>
    <div className="container mx-auto py-10 flex justify-center items-start pt-20">
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
              Simulate scanning a QR code by pasting the event details below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder='e.g., {"eventId":1}'
                value={qrValue}
                onChange={(e) => setQrValue(e.target.value)}
                aria-label="QR Code Value"
                className="h-12 text-center text-lg"
              />
              <Button onClick={handleCheckIn} className="w-full h-12 text-lg">
                Check In
              </Button>
            </div>

            <AnimatePresence>
              {checkinStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="mt-6"
                >
                  <Alert variant="default" className="bg-green-50/50 dark:bg-green-900/30 border-green-500/30">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-800 dark:text-green-300 font-bold text-lg">Check-in Successful!</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-400">
                      Welcome to <strong>{checkedInEvent}</strong>. Enjoy the event!
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
                    <AlertTitle className='font-bold text-lg'>Check-in Failed</AlertTitle>
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
