
"use client";

import Link from 'next/link';
import { Disc3, LogOut, User as UserIcon, Menu, Bell, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';
import { DarkModeToggle } from './DarkModeToggle';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useAppData } from '@/context/EventContext';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout, loading } = useAuth();
  const { alerts } = useAppData();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        {user && (
            <div className="md:hidden">
                <Button size="icon" variant="ghost" onClick={onMenuClick}>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </div>
        )}
        <Link href="/" className="mr-6 hidden md:flex items-center space-x-2">
          <Disc3 className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">
            Y-Ultimate Pulse
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
            <DarkModeToggle />

          {loading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className='relative'>
                        <Bell className="h-5 w-5" />
                        {alerts.length > 0 && (
                            <span className="absolute top-1 right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                        )}
                        <span className="sr-only">Toggle Notifications</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-80 p-0'>
                    <div className='p-4'>
                         <h3 className='text-lg font-semibold'>Notifications</h3>
                         <p className='text-sm text-muted-foreground'>You have {alerts.length} new messages.</p>
                    </div>
                    <ScrollArea className='h-72'>
                        <div className='p-4 pt-0 space-y-4'>
                            {alerts.map(alert => (
                                <div key={alert.id} className='flex items-start gap-3'>
                                    <div>
                                         {alert.type === 'destructive' ? (
                                             <div className='h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center'>
                                                <AlertTriangle className='w-5 h-5 text-destructive'/>
                                             </div>
                                         ) : (
                                            <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                                                <Info className='w-5 h-5 text-primary'/>
                                             </div>
                                         )}
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium'>{alert.message}</p>
                                        {alert.cta && (
                                            <Button asChild size='sm' variant='link' className='p-0 h-auto'>
                                                <Link href={alert.cta.href}>{alert.cta.label}</Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/50">
                    <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <Badge variant="outline">{user.role}</Badge>
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (
             null
          )}
        </div>
      </div>
    </header>
  );
}
