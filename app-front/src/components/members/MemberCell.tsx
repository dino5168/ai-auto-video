interface MemberCellProps {
  name: string
  email: string
  avatarUrl: string
}

export function MemberCell({ name, email, avatarUrl }: MemberCellProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={avatarUrl}
        alt={name}
        className="h-9 w-9 rounded-full object-cover shrink-0"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">{name}</p>
        <p className="truncate text-xs text-[#AFA9EC]">{email}</p>
      </div>
    </div>
  )
}
