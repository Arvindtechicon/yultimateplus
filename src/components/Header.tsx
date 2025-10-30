"use client";

import Link from 'next/link';
import { Disc3, LogOut, User as UserIcon, Map, QrCode, LayoutDashboard, Calendar } from 'lucide-react';
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
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/map', label: 'Map', icon: Map },
    { href: '/checkin', label: 'Check-in', icon: QrCode },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Disc3 className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">
            Y-Ultimate Pulse
          </span>
        </Link>
        <nav className="hidden items-center space-x-4 lg:flex lg:flex-1 lg:justify-center">
          {navLinks.map((link) => (
            (!link.requiresAuth || user) && (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            )
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4 lg:flex-none">
          {loading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground pt-1 font-semibold">{user.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button onClick={() => router.push('/')}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}
