import type { StatementStatus } from '../types/statement'

export default function StatusBadge({ status }: { status: StatementStatus }) {
  const map = {
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
  }

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium capitalize ${map[status]}`}>
      {status}
    </span>
  )
}
