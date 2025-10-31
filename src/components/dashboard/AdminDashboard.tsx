import { users, organizations, venues } from '@/lib/mockData';
import { StatCard } from './StatCard';
import { Users, Calendar, Building, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import EventCard from '../EventCard';
import { useEvents } from '@/context/EventContext';

export default function AdminDashboard() {
    const { events } = useEvents();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        Admin Dashboard
    </motion.h1>
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard title="Total Users" value={users.length} icon={Users} description="All registered users" />
        <StatCard title="Total Events" value={events.length} icon={Calendar} description="Across all organizations" />
        <StatCard title="Organizations" value={organizations.length} icon={Building} />
        <StatCard title="Venues" value={venues.length} icon={MapPin} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className='glass-card'>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
            <CardDescription>A complete overview of all events in the system.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
                <EventCard event={event} key={event.id} />
            ))}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className='glass-card'>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>List of all users in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[64px]'></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
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
                    <TableCell className="hidden md:table-cell">{user.email}</TableCell>
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
      </motion.div>
    </div>
  );
}
