import { MembersTable } from '@/components/members/MembersTable'

export function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-white">Analytics</h1>
      <MembersTable />
    </div>
  )
}
