
'use client';

import { motion } from 'framer-motion';
import { Award, Shield, Trophy, Star, TrendingUp, Download, Eye, QrCode } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockTeams, mockPlayerStats } from '@/lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import QRCodeComponent from 'qrcode.react';

const topPlayers = mockPlayerStats.sort((a, b) => b.score - a.score).slice(0, 3);
const topTeams = mockTeams.sort((a, b) => b.wins - a.wins).slice(0, 3);
const topSpirit = mockTeams.sort((a, b) => b.spiritScore - a.spiritScore).slice(0, 3);


const Certificate = ({ name, achievement }: { name: string, achievement: string }) => (
    <div className="p-8 bg-background border-4 border-amber-400 aspect-[4/3] w-full max-w-lg mx-auto flex flex-col items-center justify-center text-center">
        <Trophy className="w-16 h-16 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-muted-foreground">Certificate of Achievement</h2>
        <p className="text-sm text-muted-foreground mt-2">This certifies that</p>
        <p className="text-4xl font-bold my-4">{name}</p>
        <p className="text-lg text-muted-foreground">has achieved the title of</p>
        <p className="text-2xl font-semibold text-primary mt-2">{achievement}</p>
        <div className='mt-8 flex items-center gap-4'>
            <QRCodeComponent value={`https://y-ultimate-pulse.com/verify/${name}-${achievement}`} size={80} />
            <div>
                <p className='text-xs text-muted-foreground'>Issued: {new Date().toLocaleDateString()}</p>
                 <p className='text-xs text-muted-foreground'>Verify at y-ultimate-pulse.com</p>
            </div>
        </div>
    </div>
);

export default function LeaderboardPage() {

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: (i: number) => ({
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            delay: i * 0.1,
            type: 'spring',
            stiffness: 100,
          },
        }),
      };
      
  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-full shadow-inner border border-primary/20">
            <Award className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Tournament Leaderboards
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
            Celebrating the top performers and the spirit of the game.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12">
            {topPlayers.map((player, index) => (
                 <motion.div
                    key={player.id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    >
                    <Card className={`glass-card h-full relative overflow-hidden border-2 ${
                        index === 0 ? 'border-amber-400' : index === 1 ? 'border-slate-400' : 'border-amber-700'
                    }`}>
                        <CardHeader className='text-center items-center'>
                             <div className={`absolute top-2 right-2 p-2 rounded-full ${
                                index === 0 ? 'bg-amber-400/20' : index === 1 ? 'bg-slate-400/20' : 'bg-amber-700/20'
                            }`}>
                                <Trophy className={`w-6 h-6 ${
                                    index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-400' : 'text-amber-700'
                                }`} />
                             </div>
                            <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20">
                                <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${player.name}`} />
                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{player.name}</CardTitle>
                            <CardDescription>{player.team}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-4xl font-bold">{player.score}</p>
                            <p className="text-sm text-muted-foreground">Player Score</p>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="link" className="mt-2">View Certificate</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                        <DialogTitle>Certificate for {player.name}</DialogTitle>
                                        <DialogDescription>
                                            This certificate recognizes the outstanding achievement of {player.name}.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Certificate name={player.name} achievement={`Top Player #${index+1}`} />
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><Trophy className='w-5 h-5 text-primary' /> Team Rankings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Team</TableHead>
                                    <TableHead>W/L</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topTeams.map((team, index) => (
                                    <TableRow key={team.id}>
                                        <TableCell className="font-bold text-lg">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{team.name}</TableCell>
                                        <TableCell>{team.wins}/{team.losses}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><Shield className='w-5 h-5 text-primary' /> Spirit of the Game</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Team</TableHead>
                                    <TableHead>Spirit Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topSpirit.map((team, index) => (
                                    <TableRow key={team.id}>
                                        <TableCell className="font-bold text-lg">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{team.name}</TableCell>
                                        <TableCell>{team.spiritScore}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
        
      </div>
    </DashboardLayout>
  );
}
