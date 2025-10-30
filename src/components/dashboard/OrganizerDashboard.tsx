import type { User } from '@/lib/mockData';
import { events, organizations, venues } from '@/lib/mockData';
import { StatCard } from './StatCard';
import { Calendar, Users, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

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
          <CardTitle>Your Upcoming Events</CardTitle>
          <CardDescription>A list of events you are organizing.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {myEvents.length > 0 ? myEvents.map(event => {
            const venue = venues.find(v => v.id === event.venueId);
            return (
              <Card key={event.id} className="flex flex-col hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>{format(new Date(event.date), 'MMMM d, yyyy')} at {venue?.name}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                </CardContent>
                <div className="p-6 pt-0 flex justify-between items-center">
                   <Badge variant="secondary">{event.type}</Badge>
                   <div className="text-sm font-medium flex items-center">
                    <Users className='w-4 h-4 mr-2 text-muted-foreground' />
                    {event.participants.length} Participants
                   </div>
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
