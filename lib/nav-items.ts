import {
  LayoutDashboard,
  CalendarRange,
  Users,
  Wallet,
  FileText,
  BedDouble,
  Plane,
  UserRound,
  Kanban,
  Landmark,
  FileSpreadsheet,
  Bell,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

export interface NavGroup {
  label: string | null;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    items: [
      { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
      { label: "Notifications", href: "/notifications", icon: Bell },
    ],
  },
  {
    label: "Opérations",
    items: [
      { label: "Campagnes", href: "/campaigns", icon: CalendarRange },
      { label: "Pèlerins", href: "/pilgrims", icon: Users },
      { label: "CRM", href: "/crm", icon: Kanban },
      { label: "Guides", href: "/guides", icon: UserRound },
    ],
  },
  {
    label: "Logistique",
    items: [
      { label: "Documents", href: "/documents", icon: FileText },
      { label: "Chambres", href: "/rooms", icon: BedDouble },
      { label: "Vols", href: "/flights", icon: Plane },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Paiements", href: "/payments", icon: Wallet },
      { label: "Comptabilité", href: "/accounting", icon: Landmark },
      { label: "Rapports", href: "/reports", icon: FileSpreadsheet },
    ],
  },
];
