import type { MemberStatus } from './members-data'

interface StatusBadgeProps {
  status: MemberStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={
        status === 'Online'
          ? 'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-[#1DB954] text-white'
          : 'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-[#2A2550] text-[#AFA9EC]'
      }
    >
      {status}
    </span>
  )
}
