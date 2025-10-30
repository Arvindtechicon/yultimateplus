import type { User } from '@/lib/mockData';
import { events, venues } from '@/lib/mockData';
import { CalendarCheck, Trophy } from 'lucide-react';
import { StatCard } from './StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface ParticipantDashboardProps {
  user: User;
}

export default function ParticipantDashboard({ user }: ParticipantDashboardProps) {
  const registeredEvents = events.filter(event => event.participants.includes(user.id));
  const upcomingEvents = registeredEvents.filter(event => new Date(event.date) >= new Date()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = registeredEvents.filter(event => new Date(event.date) < new Date()).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welcome, {user.name.split(' ')[0]}!</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Upcoming Events" value={upcomingEvents.length} icon={CalendarCheck} description="Events you're registered for" />
        <StatCard title="Past Events" value={pastEvents.length} icon={Trophy} description="Events you've attended" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Registered Events</CardTitle>
          <CardDescription>All your upcoming and past events at a glance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Upcoming</h3>
            {upcomingEvents.length > 0 ? (
              <div className="grid gap-4">
                {upcomingEvents.map(event => {
                  const venue = venues.find(v => v.id === event.venueId);
                  return (
                    <div key={event.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{event.name}</p>
                          <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'PPPP p')}</p>
                          <p className="text-sm text-muted-foreground">{venue?.name} - {venue?.location}</p>
                        </div>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">You have no upcoming events. Check out the Events page to join one!</p>
            )}
          </div>
          
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Past</h3>
            {pastEvents.length > 0 ? (
              <div className="grid gap-4">
                {pastEvents.map(event => (
                  <div key={event.id} className="p-4 border rounded-lg opacity-70">
                     <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{event.name}</p>
                          <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'MMMM d, yyyy')}</p>
                        </div>
                        <Badge variant="ghost">{event.type}</Badge>
                      </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">You haven't attended any events yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
