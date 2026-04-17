import { useState } from 'react'
import { ChevronsUpDown, ArrowUp, ArrowDown, Pencil } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { MemberCell } from './MemberCell'
import { FunctionCell } from './FunctionCell'
import { StatusBadge } from './StatusBadge'
import { MEMBERS, PAGE_SIZE, type Member } from './members-data'

type SortKey = 'name' | 'functionTitle' | 'status' | 'employed'
type SortDir = 'asc' | 'desc' | null

interface SortState {
  key: SortKey | null
  dir: SortDir
}

function SortIcon({ column, sort }: { column: SortKey; sort: SortState }) {
  if (sort.key !== column) return <ChevronsUpDown size={14} className="ml-1 text-[#534AB7]" />
  if (sort.dir === 'asc') return <ArrowUp size={14} className="ml-1 text-[#AFA9EC]" />
  return <ArrowDown size={14} className="ml-1 text-[#AFA9EC]" />
}

function sortMembers(members: Member[], sort: SortState): Member[] {
  if (!sort.key || !sort.dir) return members
  return [...members].sort((a, b) => {
    const aVal = a[sort.key!]
    const bVal = b[sort.key!]
    const cmp = aVal.localeCompare(bVal)
    return sort.dir === 'asc' ? cmp : -cmp
  })
}

export function MembersTable() {
  const [sort, setSort] = useState<SortState>({ key: null, dir: null })
  const [page, setPage] = useState(1)

  function handleSort(key: SortKey) {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'asc' }
      if (prev.dir === 'asc') return { key, dir: 'desc' }
      return { key: null, dir: null }
    })
    setPage(1)
  }

  const sorted = sortMembers(MEMBERS, sort)
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const thClass = 'text-[#AFA9EC] font-semibold text-xs uppercase tracking-wider cursor-pointer select-none'

  return (
    <div className="rounded-xl border border-[#2A2550] bg-[#1A1830] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[#2A2550] hover:bg-transparent">
            <TableHead className={thClass} onClick={() => handleSort('name')}>
              <span className="flex items-center">Member <SortIcon column="name" sort={sort} /></span>
            </TableHead>
            <TableHead className={thClass} onClick={() => handleSort('functionTitle')}>
              <span className="flex items-center">Function <SortIcon column="functionTitle" sort={sort} /></span>
            </TableHead>
            <TableHead className={thClass} onClick={() => handleSort('status')}>
              <span className="flex items-center">Status <SortIcon column="status" sort={sort} /></span>
            </TableHead>
            <TableHead className={thClass} onClick={() => handleSort('employed')}>
              <span className="flex items-center">Employed <SortIcon column="employed" sort={sort} /></span>
            </TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageData.map((member) => (
            <TableRow key={member.id} className="border-[#2A2550] hover:bg-[#2A2550]/40">
              <TableCell>
                <MemberCell name={member.name} email={member.email} avatarUrl={member.avatarUrl} />
              </TableCell>
              <TableCell>
                <FunctionCell title={member.functionTitle} dept={member.functionDept} />
              </TableCell>
              <TableCell>
                <StatusBadge status={member.status} />
              </TableCell>
              <TableCell className="text-sm text-[#AFA9EC]">{member.employed}</TableCell>
              <TableCell>
                <button className="text-[#AFA9EC] hover:text-white transition-colors">
                  <Pencil size={15} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-[#2A2550] px-4 py-3">
        <span className="text-xs text-[#AFA9EC]">Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-[#2A2550] bg-transparent text-[#AFA9EC] hover:bg-[#2A2550] hover:text-white disabled:opacity-40"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border-[#2A2550] bg-transparent text-[#AFA9EC] hover:bg-[#2A2550] hover:text-white disabled:opacity-40"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
