interface FunctionCellProps {
  title: string
  dept: string
}

export function FunctionCell({ title, dept }: FunctionCellProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-[#AFA9EC]">{dept}</p>
    </div>
  )
}
