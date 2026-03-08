export function formatMoney(value: string | number) {
  const amount = Number(value || 0)
  return `${new Intl.NumberFormat('ru-RU').format(amount)} so'm`
}

export function formatDate(value: string) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-CA')
}

export function toApiAmount(value: string) {
  if (!value) return '0.00'
  const amount = Number(String(value).replace(/,/g, '').trim())
  return Number.isFinite(amount) ? amount.toFixed(2) : '0.00'
}
