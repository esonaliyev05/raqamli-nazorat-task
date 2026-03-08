import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { contracts, counterparties, purchaseTypes } from '../data/mockData'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  clearCurrent,
  createStatementAction,
  fetchStatementDetail,
  updateStatementAction,
} from '../store/statementsSlice'
import type { StatementFormErrors, StatementFormItem, StatementPayload, StatementStatus } from '../types/statement'
import { formatMoney } from '../utils/format'

const emptyItem = (): StatementFormItem => ({
  counterparty: null,
  contract: null,
  entry_type: '',
  amount: '',
  comment: '',
})

export default function StatementFormPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const detailId = Number(id)

  const { current, loading, saveLoading } = useAppSelector((state) => state.statements)

  const [form, setForm] = useState<StatementPayload>({
    date: '',
    purchase_type: null,
    status: 'draft',
    comment: '',
    employee_name: '',
    items: [emptyItem()],
  })
  const [errors, setErrors] = useState<StatementFormErrors>({})

  useEffect(() => {
    if (isEdit && detailId) {
      dispatch(fetchStatementDetail(detailId))
    }

    return () => {
      dispatch(clearCurrent())
    }
  }, [dispatch, isEdit, detailId])

  useEffect(() => {
    if (!current || !isEdit) return

    setForm({
      date: current.date,
      purchase_type: current.purchase_type?.id ?? null,
      status: current.status,
      comment: current.comment,
      employee_name: current.employee_name || '',
      items:
        current.prefetched_items.length > 0
          ? current.prefetched_items.map((item) => ({
              id: item.id,
              counterparty: item.counterparty?.id ?? null,
              contract: item.contract?.id ?? null,
              entry_type: item.entry_type,
              amount: item.amount,
              comment: item.comment || '',
            }))
          : [emptyItem()],
    })
  }, [current, isEdit])

  const totals = useMemo(() => {
    return form.items.reduce(
      (acc, item) => {
        const amount = Number(item.amount || 0)
        if (item.entry_type === 'in') acc.totalIn += amount
        if (item.entry_type === 'out') acc.totalOut += amount
        return acc
      },
      { totalIn: 0, totalOut: 0 },
    )
  }, [form.items])

  const setField = <K extends keyof StatementPayload>(key: K, value: StatementPayload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateItem = (index: number, key: keyof StatementFormItem, value: StatementFormItem[keyof StatementFormItem]) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }))
  }

  const addRow = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }))
  }

  const removeRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.length === 1 ? [emptyItem()] : prev.items.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const validate = () => {
    const nextErrors: StatementFormErrors = { items: [] }

    if (!form.date) nextErrors.date = 'Sana tanlanishi kerak'
    if (!form.employee_name.trim()) nextErrors.employee_name = 'Xodim ismi kiritilishi kerak'
    if (!form.purchase_type) nextErrors.purchase_type = 'Turi tanlanishi kerak'

    form.items.forEach((item, index) => {
      const rowError: { entry_type?: string; amount?: string } = {}

      if (!item.entry_type) rowError.entry_type = 'Entry type tanlanishi kerak'
      if (!item.amount.trim()) {
        rowError.amount = 'Amount kiritilishi kerak'
      } else if (Number.isNaN(Number(item.amount)) || Number(item.amount) <= 0) {
        rowError.amount = 'Amount musbat son bo‘lishi kerak'
      }

      nextErrors.items![index] = rowError
    })

    const hasItemErrors = nextErrors.items?.some((item) => item.entry_type || item.amount)
    setErrors(nextErrors)
    return !nextErrors.date && !nextErrors.employee_name && !nextErrors.purchase_type && !hasItemErrors
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return

    if (isEdit && detailId) {
      await dispatch(updateStatementAction({ id: detailId, payload: form }))
    } else {
      await dispatch(createStatementAction(form))
    }

    navigate('/')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[28px] border border-line bg-white p-6 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEdit ? 'Ko‘chirmani tahrirlash' : 'Yangi ko‘chirma yaratish'}</h1>
          <p className="mt-2 text-slate-500">PATCH/POST mantiqi va item id lar bilan ishlashga tayyor</p>
        </div>

        <Link to="/" className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-200">
          Orqaga
        </Link>
      </section>

      {loading && isEdit ? <div className="rounded-2xl bg-white p-5 shadow-soft">Yuklanmoqda...</div> : null}

      <section className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-semibold">Sana</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
              className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-blue-300"
            />
            {errors.date ? <p className="mt-1 text-sm text-red-600">{errors.date}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Xodim</label>
            <input
              type="text"
              value={form.employee_name}
              onChange={(e) => setField('employee_name', e.target.value)}
              placeholder="Xodim ismi"
              className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-blue-300"
            />
            {errors.employee_name ? <p className="mt-1 text-sm text-red-600">{errors.employee_name}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Turi</label>
            <select
              value={form.purchase_type ?? ''}
              onChange={(e) => setField('purchase_type', e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-blue-300"
            >
              <option value="">Tanlang</option>
              {purchaseTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.purchase_type ? <p className="mt-1 text-sm text-red-600">{errors.purchase_type}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Status</label>
            <select
              value={form.status}
              onChange={(e) => setField('status', e.target.value as StatementStatus)}
              className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-blue-300"
            >
              <option value="draft">draft</option>
              <option value="approved">approved</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold">Izoh</label>
          <textarea
            value={form.comment}
            onChange={(e) => setField('comment', e.target.value)}
            placeholder="Izoh"
            rows={4}
            className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-blue-300"
          />
        </div>
      </section>

      <section className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Elementlar</h2>
            <p className="text-sm text-slate-500">Master-detail dynamic form</p>
          </div>

          <button
            type="button"
            onClick={addRow}
            className="rounded-2xl bg-brand px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            + Qator qo‘shish
          </button>
        </div>

        <div className="space-y-4">
          {form.items.map((item, index) => (
            <div key={item.id ?? index} className="rounded-[24px] border border-line p-4 md:p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">Qator #{index + 1}</h3>
                  {item.id ? <p className="text-sm text-slate-500">Item id: {item.id}</p> : <p className="text-sm text-slate-500">Yangi qator</p>}
                </div>

                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="rounded-2xl bg-slate-100 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  O‘chirish
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Counterparty</label>
                  <select
                    value={item.counterparty ?? ''}
                    onChange={(e) => updateItem(index, 'counterparty', e.target.value ? Number(e.target.value) : null)}
                    className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-blue-300"
                  >
                    <option value="">Tanlang</option>
                    {counterparties.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Contract</label>
                  <select
                    value={item.contract ?? ''}
                    onChange={(e) => updateItem(index, 'contract', e.target.value ? Number(e.target.value) : null)}
                    className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-blue-300"
                  >
                    <option value="">Tanlang</option>
                    {contracts.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.number}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Entry type</label>
                  <select
                    value={item.entry_type}
                    onChange={(e) => updateItem(index, 'entry_type', e.target.value as StatementFormItem['entry_type'])}
                    className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-blue-300"
                  >
                    <option value="">Tanlang</option>
                    <option value="in">in</option>
                    <option value="out">out</option>
                  </select>
                  {errors.items?.[index]?.entry_type ? (
                    <p className="mt-1 text-sm text-red-600">{errors.items[index].entry_type}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Amount</label>
                  <input
                    type="text"
                    value={item.amount}
                    onChange={(e) => updateItem(index, 'amount', e.target.value)}
                    placeholder="0"
                    className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-blue-300"
                  />
                  {errors.items?.[index]?.amount ? <p className="mt-1 text-sm text-red-600">{errors.items[index].amount}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Comment</label>
                  <input
                    type="text"
                    value={item.comment}
                    onChange={(e) => updateItem(index, 'comment', e.target.value)}
                    placeholder="Comment"
                    className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-blue-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
          <p className="text-sm text-slate-500">Jami kirim</p>
          <p className="mt-3 text-4xl font-bold text-emerald-700">{formatMoney(totals.totalIn)}</p>
        </div>

        <div className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
          <p className="text-sm text-slate-500">Jami chiqim</p>
          <p className="mt-3 text-4xl font-bold text-rose-700">{formatMoney(totals.totalOut)}</p>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saveLoading}
          className="rounded-2xl bg-brand px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saveLoading ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </div>
    </form>
  )
}
