import type { ContractOption, CounterpartyOption, PurchaseType, StatementDetail, StatementListItem } from '../types/statement'

export const purchaseTypes: PurchaseType[] = [
  { id: 1, name: "Bojxona to'lovlari" },
  { id: 2, name: 'Kunlik xarajatlar' },
  { id: 3, name: "Xizmat safari" },
  { id: 4, name: 'Material xaridi' },
]

export const counterparties: CounterpartyOption[] = [
  { id: 1, name: 'Artel MCHJ' },
  { id: 2, name: 'Uzbekneftegaz MCHJ' },
  { id: 3, name: 'Mega Trade LLC' },
  { id: 4, name: 'Orient Finans' },
  { id: 5, name: 'Soliq boshqarmasi' },
]

export const contracts: ContractOption[] = [
  { id: 5, number: 'SH-1524' },
  { id: 9, number: 'CN-2026-09' },
  { id: 12, number: 'KT-4400' },
  { id: 15, number: 'AG-7781' },
]

export const statementList: StatementListItem[] = [
  {
    id: 1,
    number: 'BS-2026-001',
    date: '2026-03-01',
    status: 'draft',
    is_approved: false,
    purchase_type: purchaseTypes[1],
    employee_name: 'Asadbek Muxtorov',
    total_in: '252641663.00',
    total_out: '158000000.00',
    comment: 'Birinchi draft hujjat',
    created_at: '2026-03-01T12:00:00Z',
    updated_at: '2026-03-01T12:00:00Z',
  },
  {
    id: 2,
    number: 'BS-2026-002',
    date: '2026-03-05',
    status: 'approved',
    is_approved: true,
    purchase_type: purchaseTypes[0],
    employee_name: 'Alyorbek Esonaliyev',
    total_in: '1000000.00',
    total_out: '450000.00',
    comment: 'Tasdiqlangan hujjat',
    created_at: '2026-03-05T09:30:00Z',
    updated_at: '2026-03-05T09:30:00Z',
  },
]

export const statementDetails: Record<number, StatementDetail> = {
  1: {
    id: 1,
    number: 'BS-2026-001',
    date: '2026-03-01',
    purchase_type: purchaseTypes[1],
    status: 'draft',
    comment: 'Birinchi draft hujjat',
    employee_name: 'Asadbek Muxtorov',
    prefetched_items: [
      {
        id: 15,
        counterparty: counterparties[1],
        contract: contracts[0],
        entry_type: 'in',
        amount: '1500000.00',
        comment: 'Avans',
      },
      {
        id: 16,
        counterparty: counterparties[4],
        contract: null,
        entry_type: 'out',
        amount: '500000.00',
        comment: "Soliq to'lovi",
      },
    ],
  },
  2: {
    id: 2,
    number: 'BS-2026-002',
    date: '2026-03-05',
    purchase_type: purchaseTypes[0],
    status: 'approved',
    comment: 'Tasdiqlangan hujjat',
    employee_name: 'Alyorbek Esonaliyev',
    prefetched_items: [
      {
        id: 19,
        counterparty: counterparties[2],
        contract: contracts[2],
        entry_type: 'in',
        amount: '1000000.00',
        comment: 'Kirim',
      },
      {
        id: 20,
        counterparty: counterparties[0],
        contract: contracts[3],
        entry_type: 'out',
        amount: '450000.00',
        comment: 'To\'lov',
      },
    ],
  },
}
