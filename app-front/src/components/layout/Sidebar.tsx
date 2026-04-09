import { useState } from 'react'
import { ChevronLeft, ChevronDown, MoreHorizontal } from 'lucide-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { navGroups } from './nav-config'
import { NavItem } from './NavItem'

// ─── Shared inner content ────────────────────────────────────────────────────

interface SidebarContentProps {
  collapsed: boolean
  onCollapse?: () => void
  openGroups: Record<string, boolean>
  onToggleGroup: (title: string) => void
}

function SidebarContent({
  collapsed,
  onCollapse,
  openGroups,
  onToggleGroup,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col bg-[#1E1B3A]">
      {/* Logo */}
      <div className="flex items-center gap-3 bg-[#2A2550] px-4 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7F77DD] text-sm font-bold text-white">
          十方
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="truncate text-sm font-bold leading-tight text-white">
              十方資源科技
            </p>
            <p className="truncate text-xs text-[#AFA9EC]">管理者面板</p>
          </div>
        )}
      </div>

      {/* Nav tree */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.title]
          return (
            <div key={group.title} className="mb-1">
              {!collapsed ? (
                <button
                  onClick={() => onToggleGroup(group.title)}
                  className="flex w-full items-center gap-1 px-4 py-1.5 hover:text-[#AFA9EC]"
                >
                  <ChevronDown
                    size={12}
                    className={cn(
                      'shrink-0 text-[#534AB7] transition-transform duration-200',
                      !isOpen && '-rotate-90',
                    )}
                  />
                  <span className="text-[10px] font-semibold tracking-widest text-[#534AB7]">
                    {group.title}
                  </span>
                </button>
              ) : (
                <div className="mx-3 my-2 border-t border-[#2A2550]" />
              )}

              <div
                className={cn(
                  'grid transition-[grid-template-rows] duration-200 ease-in-out',
                  isOpen || collapsed ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <ul className="space-y-0.5 overflow-hidden px-2">
                  {group.items.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      collapsed={collapsed}
                      depth={0}
                    />
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </nav>

      {/* Collapse toggle — desktop only */}
      {onCollapse && (
        <button
          onClick={onCollapse}
          className="mx-2 mb-2 flex items-center justify-center gap-2 rounded-lg bg-[#2A2550] py-2 text-sm text-[#AFA9EC] transition-colors hover:bg-[#7F77DD] hover:text-white"
        >
          <ChevronLeft
            size={16}
            className={cn('transition-transform duration-200', collapsed && 'rotate-180')}
          />
          {!collapsed && <span>Collapse sidebar</span>}
        </button>
      )}

      {/* User widget */}
      <div className="flex items-center gap-3 border-t border-[#2A2550] px-3 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7F77DD] text-xs font-bold text-white">
          AS
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold text-white">Aigars S.</p>
              <p className="truncate text-xs text-[#AFA9EC]">Admin · Engineering</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded p-1 text-[#AFA9EC] hover:bg-[#2A2550] hover:text-white">
                  <MoreHorizontal size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Public component ────────────────────────────────────────────────────────

interface SidebarProps {
  /** Mobile sheet open state — controlled by parent */
  mobileOpen?: boolean
  onMobileClose?: () => void
  className?: string
}

export function Sidebar({ mobileOpen = false, onMobileClose, className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(navGroups.map((g) => [g.title, true])),
  )
  const toggleGroup = (title: string) =>
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }))

  return (
    <TooltipProvider>
      {/* ── Desktop sidebar (lg+) ── */}
      <aside
        className={cn(
          'hidden lg:flex flex-col h-screen bg-[#1E1B3A] transition-[width] duration-200 shrink-0',
          collapsed ? 'w-[60px]' : 'w-[240px]',
          className,
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onCollapse={() => setCollapsed((c) => !c)}
          openGroups={openGroups}
          onToggleGroup={toggleGroup}
        />
      </aside>

      {/* ── Mobile drawer (< lg) ── */}
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onMobileClose?.()}>
        <SheetContent
          side="left"
          className="w-[240px] p-0 border-none bg-[#1E1B3A]"
        >
          <SidebarContent
            collapsed={false}
            openGroups={openGroups}
            onToggleGroup={toggleGroup}
          />
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  )
}
