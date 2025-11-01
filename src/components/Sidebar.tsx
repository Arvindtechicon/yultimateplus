"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Calendar,
  Map,
  QrCode,
  Users,
  Settings,
  Shield,
  Disc3,
  Trophy,
  Building,
  LineChart,
  ClipboardCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { User } from "@/lib/mockData";

interface SidebarProps {
    user: User;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const getNavLinks = (role: User['role']) => {
    const baseLinks = [
        { href: '/dashboard', label: 'Overview', icon: Home },
        { href: '/events', label: 'Events', icon: Calendar },
        { href: '/map', label: 'Map', icon: Map },
        { href: '/checkin', label: 'Check-in', icon: QrCode },
        { href: '/performance', label: 'Performance Report', icon: LineChart },
        { href: '/assessments', label: 'LSAS Assessments', icon: ClipboardCheck },
    ]

    const roleLinks = {
        Admin: [
            ...baseLinks,
            { href: '/dashboard/users', label: 'Users', icon: Users, disabled: true },
            { href: '/dashboard/organizations', label: 'Organizations', icon: Building, disabled: true },
        ],
        Organizer: [
            ...baseLinks,
            { href: '/dashboard/my-events', label: 'My Events', icon: Trophy },
        ],
        Participant: [
            ...baseLinks
        ]
    }
    return roleLinks[role] || [];
  }

  const navLinks = getNavLinks(user.role);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
                href="/"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
                <Disc3 className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="sr-only">Y-Ultimate Pulse</span>
            </Link>
            
            {navLinks.map((link) => (
                <Tooltip key={link.href}>
                    <TooltipTrigger asChild>
                    <Link
                        href={link.disabled ? "#" : link.href}
                        className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8",
                        {
                            "bg-accent text-accent-foreground": pathname === link.href,
                            "text-muted-foreground hover:text-foreground": pathname !== link.href,
                            "cursor-not-allowed opacity-50": link.disabled
                        }
                        )}
                    >
                        <link.icon className="h-5 w-5" />
                        <span className="sr-only">{link.label}</span>
                    </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{link.label}</TooltipContent>
                </Tooltip>
            ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
            <TooltipTrigger asChild>
                <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  )
}
