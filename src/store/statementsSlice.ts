import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createStatement, getStatementById, getStatements, removeStatement, updateStatement } from '../api/statements'
import type { StatementDetail, StatementListItem, StatementPayload } from '../types/statement'

interface StatementsState {
  list: StatementListItem[]
  current: StatementDetail | null
  loading: boolean
  saveLoading: boolean
  error: string
}

const initialState: StatementsState = {
  list: [],
  current: null,
  loading: false,
  saveLoading: false,
  error: '',
}

export const fetchStatements = createAsyncThunk('statements/fetchStatements', async () => {
  return await getStatements()
})

export const fetchStatementDetail = createAsyncThunk('statements/fetchStatementDetail', async (id: number) => {
  return await getStatementById(id)
})

export const createStatementAction = createAsyncThunk('statements/createStatement', async (payload: StatementPayload) => {
  return await createStatement(payload)
})

export const updateStatementAction = createAsyncThunk(
  'statements/updateStatement',
  async ({ id, payload }: { id: number; payload: StatementPayload }) => {
    return await updateStatement(id, payload)
  },
)

export const removeStatementAction = createAsyncThunk('statements/removeStatement', async (id: number) => {
  return await removeStatement(id)
})

const statementsSlice = createSlice({
  name: 'statements',
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatements.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(fetchStatements.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchStatements.rejected, (state) => {
        state.loading = false
        state.error = 'Ro‘yxatni yuklashda xatolik yuz berdi'
      })
      .addCase(fetchStatementDetail.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(fetchStatementDetail.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload
      })
      .addCase(fetchStatementDetail.rejected, (state) => {
        state.loading = false
        state.error = 'Hujjatni yuklashda xatolik yuz berdi'
      })
      .addCase(createStatementAction.pending, (state) => {
        state.saveLoading = true
      })
      .addCase(createStatementAction.fulfilled, (state, action) => {
        state.saveLoading = false
        state.list.unshift(action.payload)
      })
      .addCase(createStatementAction.rejected, (state) => {
        state.saveLoading = false
        state.error = 'Saqlashda xatolik yuz berdi'
      })
      .addCase(updateStatementAction.pending, (state) => {
        state.saveLoading = true
      })
      .addCase(updateStatementAction.fulfilled, (state, action) => {
        state.saveLoading = false
        const detail = action.payload as StatementDetail
        state.current = detail
        const totalIn = detail.prefetched_items
          .filter((item) => item.entry_type === 'in')
          .reduce((sum, item) => sum + Number(item.amount), 0)
        const totalOut = detail.prefetched_items
          .filter((item) => item.entry_type === 'out')
          .reduce((sum, item) => sum + Number(item.amount), 0)

        state.list = state.list.map((item) =>
          item.id === detail.id
            ? {
                ...item,
                date: detail.date,
                status: detail.status,
                purchase_type: detail.purchase_type,
                comment: detail.comment,
                employee_name: detail.employee_name || item.employee_name,
                total_in: totalIn.toFixed(2),
                total_out: totalOut.toFixed(2),
              }
            : item,
        )
      })
      .addCase(updateStatementAction.rejected, (state) => {
        state.saveLoading = false
        state.error = 'Tahrirlashda xatolik yuz berdi'
      })
      .addCase(removeStatementAction.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item.id !== action.payload)
      })
  },
})

export const { clearCurrent } = statementsSlice.actions
export default statementsSlice.reducer
