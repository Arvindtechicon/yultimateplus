import { mockUsers, organizations, venues, mockChildren, mockSessions } from '@/lib/mockData';
import { StatCard } from './StatCard';
import { Users, Calendar, Building, MapPin, Percent, UserCheck, BarChart3, Download, AlertTriangle, Info, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import EventCard from '../EventCard';
import { useAppData } from '@/context/EventContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend as RechartsLegend } from 'recharts';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMemo } from 'react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary-foreground))'];


export default function AdminDashboard() {
    const { events, alerts, users } = useAppData();
    const { toast } = useToast();

    const genderData = useMemo(() => {
        const maleCount = mockChildren.filter(c => c.gender === 'Male').length;
        const femaleCount = mockChildren.filter(c => c.gender === 'Female').length;
        return [
            { name: 'Male', value: maleCount },
            { name: 'Female', value: femaleCount },
        ];
    }, []);

    const sessionDates = useMemo(() => mockSessions.map(s => new Date(s.date)), []);

    const communityData = useMemo(() => {
        const communities: { [key: string]: { children: number, sessions: number, attendance: number[] } } = {};
        
        mockChildren.forEach(child => {
            if (!communities[child.community]) {
                communities[child.community] = { children: 0, sessions: 0, attendance: [] };
            }
            communities[child.community].children++;
        });

        mockSessions.forEach(session => {
            if (communities[session.community]) {
                communities[session.community].sessions++;
                if (session.status === 'completed') {
                    const totalPossible = mockChildren.filter(c => c.community === session.community).length;
                    const attendancePercentage = (session.participants.length / totalPossible) * 100;
                    communities[session.community].attendance.push(attendancePercentage);
                }
            }
        });

        return Object.entries(communities).map(([name, data]) => {
            const avgAttendance = data.attendance.length > 0 ? data.attendance.reduce((a, b) => a + b, 0) / data.attendance.length : 0;
            return { name, ...data, avgAttendance };
        });
    }, []);

    const handleDownloadReport = () => {
        // This is a mock download. In a real app, you would generate a CSV string.
        toast({
            title: "Report Generated",
            description: "Programme report has been downloaded (simulated)."
        })
    }

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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start"
      >
        <h1 className="text-3xl font-bold">
            Admin Dashboard
        </h1>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
          {alerts.map(a => (
             <Alert key={a.id} variant={a.type === 'destructive' ? 'destructive' : 'default'} className="items-start">
              {a.type === 'destructive' ? <AlertTriangle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
              <div className='ml-2'>
                <AlertTitle>{a.message}</AlertTitle>
                <AlertDescription>This is a mock alert for demonstration.</AlertDescription>
              </div>
            </Alert>
          ))}
      </motion.div>


      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard title="Total Users" value={users.length} icon={Users} description="All registered users" />
        <StatCard title="Total Children" value={mockChildren.length} icon={UserCheck} description="Children in programmes" />
        <StatCard title="Total Events" value={events.length} icon={Calendar} description="Across all organizations" />
        <StatCard title="Total Sessions" value={mockSessions.length} icon={BarChart3} description="Coaching sessions held" />
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='lg:col-span-2'
        >
            <Card className='glass-card'>
                <CardHeader>
                    <CardTitle>Community Overview</CardTitle>
                    <CardDescription>Key metrics for each community.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Community</TableHead>
                                <TableHead>Children</TableHead>
                                <TableHead>Sessions</TableHead>
                                <TableHead>Avg. Attendance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {communityData.map(community => (
                                <TableRow key={community.name}>
                                    <TableCell className="font-medium">{community.name}</TableCell>
                                    <TableCell>{community.children}</TableCell>
                                    <TableCell>{community.sessions}</TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <Percent className='h-4 w-4 text-muted-foreground' />
                                            <span>{community.avgAttendance.toFixed(1)}%</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
            <Card className='glass-card'>
                <CardHeader>
                    <CardTitle>Gender Participation</CardTitle>
                    <CardDescription>Breakdown of child participation by gender.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-48">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsLegend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            >
                <Card className='glass-card'>
                    <CardHeader>
                        <CardTitle>Coach Activity Heatmap</CardTitle>
                        <CardDescription>Visualization of all scheduled sessions.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <CalendarComponent
                            mode="multiple"
                            selected={sessionDates}
                            className="p-0"
                            classNames={{
                                day_selected: "bg-primary/80 text-primary-foreground hover:bg-primary/90",
                            }}
                        />
                    </CardContent>
                </Card>
            </motion.div>
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className='lg:col-span-2'
            >
                 <Card className='glass-card'>
                    <CardHeader>
                        <CardTitle>Programme Report Generator</CardTitle>
                        <CardDescription>Download a CSV of program data.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center text-center">
                           <h3 className='text-lg font-semibold'>Generate Detailed Reports</h3>
                           <p className='text-muted-foreground text-sm max-w-sm mt-2 mb-4'>
                                Export a comprehensive CSV file containing data on children, sessions, attendance, assessments, and home visits for analysis and reporting.
                           </p>
                            <Button onClick={handleDownloadReport}>
                                <Download className='mr-2 h-4 w-4' />
                                Download Report (CSV)
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
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
