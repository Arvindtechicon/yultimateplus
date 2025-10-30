import { users, events, organizations, venues } from '@/lib/mockData';
import { StatCard } from './StatCard';
import { Users, Calendar, Building, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import QRCode from 'qrcode.react';
import { Button } from '../ui/button';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={users.length} icon={Users} description="All registered users" />
        <StatCard title="Total Events" value={events.length} icon={Calendar} description="Across all organizations" />
        <StatCard title="Organizations" value={organizations.length} icon={Building} />
        <StatCard title="Venues" value={venues.length} icon={MapPin} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>All events in the system.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
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
                <CardContent className="flex-grow space-y-3">
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
                  <div className="flex justify-center pt-2">
                    <div className="bg-white p-2 rounded-md">
                      <QRCode value={JSON.stringify({ eventId: event.id, eventName: event.name })} size={100} />
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button className="w-full" variant="outline">
                    <MapPin className="mr-2 h-4 w-4" />
                    View on Map
                  </Button>
                </div>
              </Card>
            );
          })}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>List of all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.name}`} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'default' : user.role === 'Organizer' ? 'secondary' : 'outline'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
