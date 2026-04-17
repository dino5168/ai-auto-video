import { useEffect, useState } from 'react'
import { ICON_MAP, type NavGroup, type NavGroupAPI, type NavItemAPI } from '@/components/layout/nav-config'
import type { LucideIcon } from 'lucide-react'
import type { NavItem } from '@/components/layout/nav-config'

const API_BASE = import.meta.env.VITE_API_BASE_URL as string

function resolveItem(raw: NavItemAPI): NavItem {
  return {
    label: raw.label,
    href: raw.href,
    icon: (ICON_MAP[raw.icon] ?? ICON_MAP['HelpCircle']) as LucideIcon,
    badge: raw.badge,
    children: raw.children?.map(resolveItem),
  }
}

function resolveGroup(raw: NavGroupAPI): NavGroup {
  return {
    title: raw.title,
    items: raw.items.map(resolveItem),
  }
}

interface UseNavGroupsResult {
  navGroups: NavGroup[]
  loading: boolean
  error: string | null
}

export function useNavGroups(): UseNavGroupsResult {
  const [navGroups, setNavGroups] = useState<NavGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchMenu() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/menu`)
        if (!res.ok) throw new Error(`Menu fetch failed: ${res.status}`)
        const data: NavGroupAPI[] = await res.json()
        if (!cancelled) setNavGroups(data.map(resolveGroup))
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchMenu()
    return () => { cancelled = true }
  }, [])

  return { navGroups, loading, error }
}
