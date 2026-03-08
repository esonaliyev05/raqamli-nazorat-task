interface MiniBarsProps {
  inValue: number
  outValue: number
}

export default function MiniBars({ inValue, outValue }: MiniBarsProps) {
  const max = Math.max(inValue, outValue, 1)
  const inPercent = (inValue / max) * 100
  const outPercent = (outValue / max) * 100

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Kirim va chiqim nisbati</h3>
          <p className="text-sm text-slate-500">Oddiy vizual ko‘rinish</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Kirim</span>
            <span>{inValue.toLocaleString('ru-RU')}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${inPercent}%` }} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Chiqim</span>
            <span>{outValue.toLocaleString('ru-RU')}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-rose-500" style={{ width: `${outPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
