'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Map,
  QrCode,
  Users,
  Settings,
  Disc3,
  Trophy,
  Building,
  LineChart,
  ClipboardCheck,
  Group,
  BookOpen,
  BarChart2,
  Image,
  X,
  Heart,
  Award
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/mockData';

interface SidebarProps {
  user: User;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export function Sidebar({ user, isOpen, setOpen }: SidebarProps) {
  const pathname = usePathname();

  const getNavLinks = (role: User['role']) => {
    const baseLinks = [
      { href: '/dashboard', label: 'Overview', icon: Home },
      { href: '/events', label: 'Events', icon: Calendar },
      { href: '/coaching', label: 'Coaching', icon: BookOpen },
      { href: '/leaderboard', label: 'Leaderboard', icon: Award },
      { href: '/map', label: 'Map', icon: Map },
      { href: '/checkin', label: 'Check-in', icon: QrCode },
      { href: '/gallery', label: 'Gallery', icon: Image },
    ];

    const participantLinks = [
      ...baseLinks,
      { href: '/performance', label: 'Performance Report', icon: LineChart },
      {
        href: '/assessments',
        label: 'LSAS Assessments',
        icon: ClipboardCheck,
      },
    ];

    const organizerLinks = [
        { href: '/dashboard', label: 'Overview', icon: Home },
        { href: '/dashboard/my-events', label: 'My Events', icon: Trophy },
        { href: '/leaderboard', label: 'Leaderboard', icon: Award },
        { href: '/team-performance', label: 'Team Performance', icon: Group },
        { href: '/reports', label: 'Event Reports', icon: BarChart2 },
        { href: '/gallery', label: 'Gallery', icon: Image },
    ];

    const coachLinks = [
        { href: '/dashboard', label: 'Overview', icon: Home },
        { href: '/events', label: 'Events', icon: Calendar },
        { href: '/coaching', label: 'Coaching', icon: BookOpen },
        { href: '/checkin', label: 'Session Check-in', icon: QrCode },
        { href: '/leaderboard', label: 'Leaderboard', icon: Award },
        { href: '/assessments', label: 'LSAS Assessments', icon: ClipboardCheck },
        { href: '/home-visits', label: 'Home Visits', icon: Heart },
        { href: '/reports', label: 'Programme Reports', icon: BarChart2 },
        { href: '/gallery', label: 'Gallery', icon: Image },
    ];

    const adminLinks = [
      ...baseLinks,
      { href: '/team-performance', label: 'Team Performance', icon: Group },
      {
        href: '/assessments',
        label: 'LSAS Assessments',
        icon: ClipboardCheck,
      },
      { href: '/home-visits', label: 'Home Visits', icon: Heart },
      { href: '/reports', label: 'Programme Reports', icon: BarChart2 },
      { href: '/dashboard/users', label: 'Users', icon: Users },
      {
        href: '/dashboard/organizations',
        label: 'Organizations',
        icon: Building,
      },
    ];

    const roleLinks = {
      Admin: adminLinks,
      Organizer: organizerLinks,
      Participant: participantLinks,
      Coach: coachLinks,
    };
    return roleLinks[role] || [];
  };

  const navLinks = getNavLinks(user.role);

  const NavContent = () => (
    <nav className="flex flex-col gap-2">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setOpen(false)}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            {
              'bg-muted text-primary': pathname === link.href,
            }
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 sm:hidden">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold"
                onClick={() => setOpen(false)}
              >
                <Disc3 className="h-6 w-6 text-primary" />
                <span>Y-Ultimate Pulse</span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden sm:fixed sm:inset-y-0 sm:left-0 sm:z-10 sm:block sm:w-72 sm:border-r sm:bg-background">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Disc3 className="h-6 w-6 text-primary" />
              <span className="">Y-Ultimate Pulse</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <NavContent />
          </div>
          <div className="mt-auto p-4 border-t">
             <Link
                href="/settings"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", { 'bg-muted text-primary': pathname === '/settings' })}
            >
                <Settings className="h-4 w-4" />
                Settings
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
