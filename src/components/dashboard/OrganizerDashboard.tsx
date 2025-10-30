import type { User } from '@/lib/mockData';
import { events, organizations, venues } from '@/lib/mockData';
import { StatCard } from './StatCard';
import { Calendar, Users, Building, MapPin, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import QRCode from 'qrcode.react';
import Link from 'next/link';

interface OrganizerDashboardProps {
  user: User;
}

export default function OrganizerDashboard({ user }: OrganizerDashboardProps) {
  const myOrganizations = organizations.filter(org => org.organizers.includes(user.id));
  const myOrgIds = myOrganizations.map(org => org.id);
  const myEvents = events.filter(event => myOrgIds.includes(event.organizationId));

  const totalParticipants = myEvents.reduce((acc, event) => acc + event.participants.length, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Your Events" value={myEvents.length} icon={Calendar} description="Events you are organizing" />
        <StatCard title="Total Participants" value={totalParticipants} icon={Users} description="Across all your events" />
        <StatCard title="Your Organizations" value={myOrganizations.length} icon={Building} description="Organizations you are part of" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Events</CardTitle>
          <CardDescription>A list of events you are organizing.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {myEvents.length > 0 ? myEvents.map(event => {
            const venue = venues.find(v => v.id === event.venueId);
            const organization = organizations.find(o => o.id === event.organizationId);
            return (
              <Card key={event.id} className="overflow-hidden flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl flex justify-between items-center">
                    {event.name}
                    <Badge variant="secondary">{event.type}</Badge>
                  </CardTitle>
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
                      <QRCode value={JSON.stringify({ eventId: event.id, eventName: event.name })} size={100} />
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 grid grid-cols-2 gap-2">
                  <Link href={`/map?venueId=${event.venueId}`} passHref>
                    <Button variant="outline" className="w-full">
                        <MapPin className="mr-2 h-4 w-4" />
                        View on Map
                    </Button>
                  </Link>
                  <Button>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Event
                  </Button>
                </div>
              </Card>
            )
          }) : (
            <p className="text-muted-foreground text-sm p-4 col-span-full text-center">You are not organizing any events.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
