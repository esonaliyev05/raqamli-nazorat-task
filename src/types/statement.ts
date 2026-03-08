export type StatementStatus = 'draft' | 'approved' | 'cancelled'
export type EntryType = 'in' | 'out'

export interface PurchaseType {
  id: number
  name: string
}

export interface CounterpartyOption {
  id: number
  name: string
}

export interface ContractOption {
  id: number
  number: string
}

export interface StatementListItem {
  id: number
  number: string
  date: string
  status: StatementStatus
  is_approved?: boolean
  purchase_type: PurchaseType | null
  employee_name: string
  total_in: string
  total_out: string
  comment: string
  created_at?: string
  updated_at?: string
}

export interface StatementFormItem {
  id?: number
  counterparty: number | null
  contract: number | null
  entry_type: EntryType | ''
  amount: string
  comment: string
}

export interface StatementDetail {
  id: number
  number: string
  date: string
  purchase_type: PurchaseType | null
  status: StatementStatus
  comment: string
  employee_name?: string
  prefetched_items: Array<{
    id: number
    counterparty: CounterpartyOption | null
    contract: ContractOption | null
    entry_type: EntryType
    amount: string
    comment: string
  }>
}

export interface StatementPayload {
  date: string
  purchase_type: number | null
  status: StatementStatus
  comment: string
  employee_name: string
  items: StatementFormItem[]
}

export interface StatementFormErrors {
  date?: string
  purchase_type?: string
  employee_name?: string
  items?: Array<{
    entry_type?: string
    amount?: string
  }>
}
