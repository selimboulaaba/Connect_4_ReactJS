// Tiny global toast store: toast.success('Saved'), toast.info('...', { action: { label, onClick } }).
export let toasts = []
let nextId = 1
export const listeners = new Set()
const emit = () => listeners.forEach((l) => l())

export function dismiss(id) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

function show(tone, message, { title, action, duration = tone === 'error' ? 6000 : 4000, id } = {}) {
  const key = id ?? nextId++
  toasts = [...toasts.filter((t) => t.id !== key), { id: key, tone, message, title, action }].slice(-4)
  emit()
  if (duration !== Infinity) setTimeout(() => dismiss(key), duration)
  return key
}

export const toast = {
  success: (m, o) => show('success', m, o),
  error: (m, o) => show('error', m, o),
  info: (m, o) => show('info', m, o),
  warn: (m, o) => show('warn', m, o),
  dismiss,
}
