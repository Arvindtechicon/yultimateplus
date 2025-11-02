"use client";

import Link from 'next/link';
import { Disc3, LogOut, User as UserIcon, Menu } from 'lucide-react';
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

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <div className="md:hidden">
            <Button size="icon" variant="ghost" onClick={onMenuClick}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
            </Button>
        </div>
        <Link href="/" className="mr-6 hidden md:flex items-center space-x-2">
          <Disc3 className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">
            Y-Ultimate Pulse
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
            <DarkModeToggle />
          {loading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
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
          ) : null}
        </div>
      </div>
    </header>
  );
}
