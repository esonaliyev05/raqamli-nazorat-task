import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DeleteModal from '../components/DeleteModal'
import MiniBars from '../components/MiniBars'
import StatsCards from '../components/StatsCards'
import StatusBadge from '../components/StatusBadge'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchStatements, removeStatementAction } from '../store/statementsSlice'
import { formatDate, formatMoney } from '../utils/format'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { list, loading, error } = useAppSelector((state) => state.statements)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchStatements())
  }, [dispatch])

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase()
    if (!value) return list
    return list.filter((item) => {
      return (
        item.number.toLowerCase().includes(value) ||
        item.employee_name.toLowerCase().includes(value) ||
        item.status.toLowerCase().includes(value)
      )
    })
  }, [list, search])

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, item) => {
        acc.totalIn += Number(item.total_in)
        acc.totalOut += Number(item.total_out)
        return acc
      },
      { totalIn: 0, totalOut: 0 },
    )
  }, [filtered])

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[28px] border border-line bg-white p-6 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bank statements dashboard</h1>
          <p className="mt-2 text-slate-500">GET /bank-statement/ asosida ro‘yxat, DELETE va status</p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center justify-center rounded-2xl bg-brand px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          + Yangi ko‘chirma
        </Link>
      </section>

      <StatsCards totalStatements={filtered.length} totalIn={totals.totalIn} totalOut={totals.totalOut} />

      <MiniBars inValue={totals.totalIn} outValue={totals.totalOut} />

      <section className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Ko‘chirmalar ro‘yxati</h2>
            <p className="text-sm text-slate-500">Statusga qarab satr rangi farqlanadi</p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Raqam, xodim yoki status bo‘yicha qidirish"
            className="w-full rounded-2xl border border-line px-4 py-3 outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-300 md:max-w-sm"
          />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-line px-4 py-10 text-center text-slate-500">Yuklanmoqda...</div>
        ) : error ? (
          <div className="rounded-2xl bg-rose-50 px-4 py-4 text-rose-700">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line px-4 py-10 text-center text-slate-500">
            Ko‘chirmalar topilmadi
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-line">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Raqami</th>
                    <th className="px-5 py-4 font-semibold">Sanasi</th>
                    <th className="px-5 py-4 font-semibold">Xodim</th>
                    <th className="px-5 py-4 font-semibold">Jami kirim</th>
                    <th className="px-5 py-4 font-semibold">Jami chiqim</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">Amallar</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((item) => {
                    const rowTone =
                      item.status === 'approved'
                        ? 'bg-emerald-50/50'
                        : item.status === 'draft'
                          ? 'bg-slate-50/40'
                          : 'bg-rose-50/50'

                    return (
                      <tr key={item.id} className={`border-t border-line ${rowTone}`}>
                        <td className="px-5 py-4 font-semibold text-slate-900">{item.number}</td>
                        <td className="px-5 py-4">{formatDate(item.date)}</td>
                        <td className="px-5 py-4">{item.employee_name}</td>
                        <td className="px-5 py-4 font-medium text-emerald-700">{formatMoney(item.total_in)}</td>
                        <td className="px-5 py-4 font-medium text-rose-700">{formatMoney(item.total_out)}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/edit/${item.id}`}
                              className="rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-800 transition hover:bg-slate-200"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => setDeleteId(item.id)}
                              className="rounded-xl bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <DeleteModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId === null) return
          await dispatch(removeStatementAction(deleteId))
          setDeleteId(null)
        }}
      />
    </div>
  )
}
