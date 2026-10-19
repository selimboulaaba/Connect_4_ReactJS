import { toast as sonner } from 'sonner'

/**
 * App toast API on top of Sonner.
 *   toast.success('Saved')
 *   toast.info('Message', { title, id, duration, action: { label, onClick } | [primary, secondary] })
 * With a title, the message becomes the description.
 */
function show(kind, message, { title, action, duration, id } = {}) {
  const [primary, secondary] = [].concat(action || [])
  return sonner[kind](title || message, {
    id,
    duration: duration ?? (kind === 'error' ? 6000 : 4000),
    description: title ? message : undefined,
    action: primary ? { label: primary.label, onClick: primary.onClick } : undefined,
    cancel: secondary ? { label: secondary.label, onClick: secondary.onClick } : undefined,
  })
}

export const toast = {
  success: (m, o) => show('success', m, o),
  error: (m, o) => show('error', m, o),
  info: (m, o) => show('info', m, o),
  warn: (m, o) => show('warning', m, o),
  dismiss: (id) => sonner.dismiss(id),
}
