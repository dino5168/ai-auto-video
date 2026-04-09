import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { NavItem as NavItemType } from './nav-config'

interface NavItemProps {
  item: NavItemType
  collapsed: boolean
  depth?: number
}

export function NavItem({ item, collapsed, depth = 0 }: NavItemProps) {
  const location = useLocation()
  const hasChildren = !!item.children?.length
  const isActive = location.pathname === item.href
  const isChildActive = item.children?.some((c) => location.pathname === c.href) ?? false
  const [open, setOpen] = useState(isChildActive)
  const Icon = item.icon

  // Leaf link
  const linkContent = (
    <Link
      to={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
        isActive
          ? 'bg-[#7F77DD] text-white'
          : 'text-[#AFA9EC] hover:bg-[#2A2550]',
        collapsed && 'justify-center px-2',
      )}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px]">
        <Icon size={16} />
      </span>
      {!collapsed && (
        <>
          <span className="flex-1 text-sm font-medium">{item.label}</span>
          {item.badge !== undefined && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7F77DD] px-1 text-xs font-semibold text-white">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  )

  // Parent toggle button (has children)
  const toggleContent = (
    <button
      onClick={() => setOpen((o) => !o)}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors',
        isChildActive
          ? 'text-white'
          : 'text-[#AFA9EC] hover:bg-[#2A2550]',
        collapsed && 'justify-center px-2',
      )}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px]">
        <Icon size={16} />
      </span>
      {!collapsed && (
        <>
          <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
          {item.badge !== undefined && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7F77DD] px-1 text-xs font-semibold text-white">
              {item.badge}
            </span>
          )}
          <ChevronRight
            size={14}
            className={cn(
              'ml-1 shrink-0 text-[#534AB7] transition-transform duration-200',
              open && 'rotate-90',
            )}
          />
        </>
      )}
    </button>
  )

  const rowContent = hasChildren ? toggleContent : linkContent

  // Wrap with tooltip when collapsed
  const row =
    collapsed ? (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{rowContent}</TooltipTrigger>
        <TooltipContent side="right">
          <span>{item.label}</span>
          {item.badge !== undefined && (
            <span className="ml-1 text-xs">({item.badge})</span>
          )}
        </TooltipContent>
      </Tooltip>
    ) : (
      rowContent
    )

  return (
    <li className="list-none">
      {/* Indentation tree guide line for depth > 0 */}
      <div
        className={cn(
          'relative',
          depth > 0 && 'ml-5 before:absolute before:left-0 before:top-0 before:h-full before:border-l before:border-[#2A2550]',
        )}
      >
        {row}
      </div>

      {/* Children */}
      {hasChildren && open && !collapsed && (
        <ul className="ml-5 border-l border-[#2A2550]">
          {item.children!.map((child) => (
            <NavItem key={child.href} item={child} collapsed={collapsed} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}
