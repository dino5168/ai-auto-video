import {
  LayoutDashboard,
  BarChart2,
  ShoppingBag,
  Users2,
  Cloud,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Mail,
  MessageSquare,
  Folder,
  KanbanSquare,
  Calendar,
  ClipboardList,
  Bell,
  Settings,
  HelpCircle,
  PieChart,
  TrendingUp,
  ClipboardCheck,
  Clock,
  XCircle,
  type LucideIcon,
} from 'lucide-react'

// Runtime type — icon is a resolved React component
export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
  children?: NavItem[]
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

// API wire type — icon is a string name from the backend
export interface NavItemAPI {
  label: string
  href: string
  icon: string
  badge?: number
  children?: NavItemAPI[]
}

export interface NavGroupAPI {
  title: string
  items: NavItemAPI[]
}

// Map backend icon name → Lucide component
export const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart2,
  ShoppingBag,
  Users2,
  Cloud,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Mail,
  MessageSquare,
  Folder,
  KanbanSquare,
  Calendar,
  ClipboardList,
  Bell,
  Settings,
  HelpCircle,
  PieChart,
  TrendingUp,
  ClipboardCheck,
  Clock,
  XCircle,
}
