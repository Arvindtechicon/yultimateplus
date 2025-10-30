"use client";

import { events, venues, organizations } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Building, Users } from 'lucide-react';
import { format } from 'date-fns';
import QRCode from 'qrcode.react';
import Link from 'next/link';

export default function EventListPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">All Events</h1>
        <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
          Browse through all the exciting Ultimate Frisbee events.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const venue = venues.find(v => v.id === event.venueId);
          const organization = organizations.find(o => o.id === event.organizationId);

          return (
            <Card key={event.id} className="overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-2xl">{event.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <Building className="w-4 h-4" />
                  <span>{organization?.name}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{format(new Date(event.date), 'PPPP p')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{venue?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{event.participants.length} participants</span>
                </div>
                <div className="flex justify-center pt-4">
                   <div className='bg-white p-2 rounded-md'>
                    <QRCode value={JSON.stringify({ eventId: event.id, eventName: event.name })} size={128} />
                   </div>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href={`/map?venueId=${event.venueId}`} passHref>
                  <Button className="w-full" variant="outline">
                      <MapPin className="mr-2 h-4 w-4" />
                      View on Map
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
