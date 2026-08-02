"use client";

import Link from "next/link";
import { Menu, LogOut, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { logout } from "@/lib/actions/auth";

const ROLE_LABELS: Record<string, string> = {
  owner: "Propriétaire",
  admin: "Administrateur",
  agent: "Agent",
};

export function Topbar({
  fullName,
  role,
  notificationCount = 0,
}: {
  fullName: string | null;
  role: string;
  notificationCount?: number;
}) {
  const initials = (fullName ?? "?")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu">
              <Menu />
            </Button>
          }
        />
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b border-border">
            <SheetTitle>Tayssir</SheetTitle>
          </SheetHeader>
          <div className="p-3">
            <SidebarNav />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <Link
        href="/notifications"
        className="relative flex size-9 items-center justify-center rounded-lg hover:bg-muted"
        aria-label={
          notificationCount > 0 ? `Notifications (${notificationCount} alerte(s))` : "Notifications"
        }
      >
        <Bell className="size-4.5" />
        {notificationCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </Link>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-1.5 py-1 outline-none hover:bg-muted"
            >
              <Avatar size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{fullName ?? "Mon compte"}</span>
            </button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-foreground">{fullName ?? "Mon compte"}</span>
              <span className="text-xs text-muted-foreground">
                {ROLE_LABELS[role] ?? role}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <User className="mr-1" /> Mon profil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => logout()}>
            <LogOut className="mr-1" /> Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
