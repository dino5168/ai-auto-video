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

export const navGroups: NavGroup[] = [
  {
    title: 'OVERVIEW',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        badge: 3,
        children: [
          { label: 'Overview', href: '/dashboard/overview', icon: PieChart },
          { label: 'Reports', href: '/dashboard/reports', icon: TrendingUp },
        ],
      },
      { label: 'Analytics', href: '/analytics', icon: BarChart2 },
      { label: 'eCommerce', href: '/ecommerce', icon: ShoppingBag },
      { label: 'CRM', href: '/crm', icon: Users2 },
      { label: 'SaaS', href: '/saas', icon: Cloud },
    ],
  },
  {
    title: 'COMMERCE',
    items: [
      {
        label: 'Orders',
        href: '/orders',
        icon: ShoppingCart,
        badge: 12,
        children: [
          { label: 'Pending', href: '/orders/pending', icon: Clock },
          { label: 'Completed', href: '/orders/completed', icon: ClipboardCheck },
          { label: 'Cancelled', href: '/orders/cancelled', icon: XCircle },
        ],
      },
      { label: 'Products', href: '/products', icon: Package },
      { label: 'Customers', href: '/customers', icon: Users },
      { label: 'Invoices', href: '/invoices', icon: FileText },
    ],
  },
  {
    title: 'APPS',
    items: [
      { label: 'Mail', href: '/mail', icon: Mail },
      { label: 'Chat', href: '/chat', icon: MessageSquare },
      { label: 'Files', href: '/files', icon: Folder },
      { label: 'Kanban', href: '/kanban', icon: KanbanSquare },
      { label: 'Calendar', href: '/calendar', icon: Calendar },
      { label: 'Forms', href: '/forms', icon: ClipboardList },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Users', href: '/users', icon: Users },
      { label: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
      { label: 'Settings', href: '/settings', icon: Settings },
      { label: 'Help & Support', href: '/help', icon: HelpCircle },
    ],
  },
]
