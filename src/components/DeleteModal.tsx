interface DeleteModalProps {
  open: boolean
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteModal({ open, loading = false, onClose, onConfirm }: DeleteModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-xl text-red-600">
          !
        </div>

        <h3 className="text-xl font-bold text-slate-900">Bank ko‘chirmani o‘chirish</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Bu amal tasdiqlansa hujjat ro‘yxatdan olib tashlanadi. Davom etishni xohlaysizmi?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Bekor qilish
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'O‘chirilmoqda...' : 'O‘chirish'}
          </button>
        </div>
      </div>
    </div>
  )
}
