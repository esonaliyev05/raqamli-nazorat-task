import { formatMoney } from '../utils/format'

interface StatsCardsProps {
  totalStatements: number
  totalIn: number
  totalOut: number
}

export default function StatsCards({ totalStatements, totalIn, totalOut }: StatsCardsProps) {
  const balance = totalIn - totalOut

  const cards = [
    { title: 'Jami hujjatlar', value: String(totalStatements), tone: 'text-slate-900' },
    { title: 'Umumiy kirim', value: formatMoney(totalIn), tone: 'text-emerald-700' },
    { title: 'Umumiy chiqim', value: formatMoney(totalOut), tone: 'text-rose-700' },
    { title: 'Qoldiq', value: formatMoney(balance), tone: balance >= 0 ? 'text-brand' : 'text-amber-700' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="rounded-3xl border border-line bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">{card.title}</p>
          <p className={`mt-3 text-2xl font-bold ${card.tone}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}
