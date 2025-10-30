"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, QrCode } from 'lucide-react';
import { events } from '@/lib/mockData';

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
      
      const eventExists = events.some(event => event.id === eventId);

      if (eventExists) {
        setCheckinStatus('success');
        setCheckedInEvent(parsedQr.eventName || `Event ID: ${eventId}`);
      } else {
        setCheckinStatus('error');
      }
    } catch (error) {
      // Handle cases where qrValue is not a valid JSON string
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
    <div className="container mx-auto py-10 flex justify-center items-center min-h-[calc(100vh-8rem)] animate-fade-in-up">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Event Check-in</CardTitle>
          <CardDescription>
            Simulate scanning a QR code by pasting the event details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder='e.g., {"eventId":1,"eventName":"Summer Breeze Tournament"}'
              value={qrValue}
              onChange={(e) => setQrValue(e.target.value)}
              aria-label="QR Code Value"
            />
            <Button onClick={handleCheckIn} className="w-full">
              Check In
            </Button>
          </div>

          {checkinStatus === 'success' && (
            <Alert variant="default" className="mt-6 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-300">Check-in Successful ✅</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-400">
                You have successfully checked into: <strong>{checkedInEvent}</strong>
              </AlertDescription>
            </Alert>
          )}

          {checkinStatus === 'error' && (
            <Alert variant="destructive" className="mt-6">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Check-in Failed</AlertTitle>
              <AlertDescription>
                Invalid or unrecognized event QR code. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
