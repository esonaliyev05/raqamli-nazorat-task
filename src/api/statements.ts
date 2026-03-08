import { apiClient, useMock } from './client'
import { statementDetails, statementList } from '../data/mockData'
import type { StatementDetail, StatementListItem, StatementPayload } from '../types/statement'
import { toApiAmount } from '../utils/format'

let mockList = structuredClone(statementList) as StatementListItem[]
let mockDetails = structuredClone(statementDetails) as Record<number, StatementDetail>

function pause() {
  return new Promise((resolve) => setTimeout(resolve, 250))
}

function nextNumber() {
  const nextId = Math.max(0, ...mockList.map((item) => item.id)) + 1
  return `BS-2026-${String(nextId).padStart(3, '0')}`
}

function calcTotals(items: StatementPayload['items']) {
  let totalIn = 0
  let totalOut = 0

  items.forEach((item) => {
    const amount = Number(item.amount || 0)
    if (item.entry_type === 'in') totalIn += amount
    if (item.entry_type === 'out') totalOut += amount
  })

  return {
    total_in: totalIn.toFixed(2),
    total_out: totalOut.toFixed(2),
  }
}

export async function getStatements() {
  if (!useMock) {
    const response = await apiClient.get('/bank-statement/')
    return response.data.results as StatementListItem[]
  }

  await pause()
  return structuredClone(mockList)
}

export async function getStatementById(id: number) {
  if (!useMock) {
    const response = await apiClient.get(`/bank-statement/${id}/`)
    return response.data as StatementDetail
  }

  await pause()
  return structuredClone(mockDetails[id])
}

export async function createStatement(payload: StatementPayload) {
  if (!useMock) {
    const response = await apiClient.post('/bank-statement/', {
      date: payload.date,
      purchase_type: payload.purchase_type,
      status: payload.status,
      comment: payload.comment,
      employee_name: payload.employee_name,
      items: payload.items.map((item) => ({
        counterparty: item.counterparty,
        contract: item.contract,
        entry_type: item.entry_type,
        amount: toApiAmount(item.amount),
        comment: item.comment,
      })),
    })
    return response.data
  }

  await pause()
  const id = Math.max(0, ...mockList.map((item) => item.id)) + 1
  const totals = calcTotals(payload.items)
  const number = nextNumber()
  const listItem: StatementListItem = {
    id,
    number,
    date: payload.date,
    status: payload.status,
    is_approved: payload.status === 'approved',
    purchase_type: payload.purchase_type ? { id: payload.purchase_type, name: `Turi #${payload.purchase_type}` } : null,
    employee_name: payload.employee_name,
    total_in: totals.total_in,
    total_out: totals.total_out,
    comment: payload.comment,
  }

  mockList = [listItem, ...mockList]
  mockDetails[id] = {
    id,
    number,
    date: payload.date,
    purchase_type: payload.purchase_type ? { id: payload.purchase_type, name: `Turi #${payload.purchase_type}` } : null,
    status: payload.status,
    comment: payload.comment,
    employee_name: payload.employee_name,
    prefetched_items: payload.items.map((item, index) => ({
      id: id * 100 + index + 1,
      counterparty: item.counterparty ? { id: item.counterparty, name: `Counterparty #${item.counterparty}` } : null,
      contract: item.contract ? { id: item.contract, number: `Contract #${item.contract}` } : null,
      entry_type: item.entry_type as 'in' | 'out',
      amount: toApiAmount(item.amount),
      comment: item.comment,
    })),
  }

  return listItem
}

export async function updateStatement(id: number, payload: Partial<StatementPayload> & { items?: StatementPayload['items'] }) {
  if (!useMock) {
    const response = await apiClient.patch(`/bank-statement/${id}/`, {
      ...(payload.date ? { date: payload.date } : {}),
      ...(payload.purchase_type !== undefined ? { purchase_type: payload.purchase_type } : {}),
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.comment !== undefined ? { comment: payload.comment } : {}),
      ...(payload.employee_name !== undefined ? { employee_name: payload.employee_name } : {}),
      ...(payload.items
        ? {
            items: payload.items.map((item) => ({
              ...(item.id ? { id: item.id } : {}),
              counterparty: item.counterparty,
              contract: item.contract,
              entry_type: item.entry_type,
              amount: toApiAmount(item.amount),
              comment: item.comment,
            })),
          }
        : {}),
    })
    return response.data
  }

  await pause()
  const detail = mockDetails[id]
  if (!detail) throw new Error('Hujjat topilmadi')

  const nextItems = payload.items || []
  const totals = calcTotals(nextItems)

  mockDetails[id] = {
    ...detail,
    date: payload.date || detail.date,
    purchase_type:
      payload.purchase_type !== undefined
        ? payload.purchase_type
          ? { id: payload.purchase_type, name: `Turi #${payload.purchase_type}` }
          : null
        : detail.purchase_type,
    status: payload.status || detail.status,
    comment: payload.comment ?? detail.comment,
    employee_name: payload.employee_name ?? detail.employee_name,
    prefetched_items: nextItems.map((item, index) => ({
      id: item.id ?? id * 100 + index + 1,
      counterparty: item.counterparty ? { id: item.counterparty, name: `Counterparty #${item.counterparty}` } : null,
      contract: item.contract ? { id: item.contract, number: `Contract #${item.contract}` } : null,
      entry_type: item.entry_type as 'in' | 'out',
      amount: toApiAmount(item.amount),
      comment: item.comment,
    })),
  }

  mockList = mockList.map((item) =>
    item.id === id
      ? {
          ...item,
          date: payload.date || item.date,
          status: payload.status || item.status,
          is_approved: (payload.status || item.status) === 'approved',
          purchase_type:
            payload.purchase_type !== undefined
              ? payload.purchase_type
                ? { id: payload.purchase_type, name: `Turi #${payload.purchase_type}` }
                : null
              : item.purchase_type,
          employee_name: payload.employee_name ?? item.employee_name,
          comment: payload.comment ?? item.comment,
          total_in: totals.total_in,
          total_out: totals.total_out,
        }
      : item,
  )

  return mockDetails[id]
}

export async function removeStatement(id: number) {
  if (!useMock) {
    await apiClient.delete(`/bank-statement/${id}/`)
    return id
  }

  await pause()
  mockList = mockList.filter((item) => item.id !== id)
  delete mockDetails[id]
  return id
}
