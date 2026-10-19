import { Toaster as Sonner } from 'sonner'
import { useTheme } from '@/lib/preferences'

export function Toaster() {
  const { resolved } = useTheme()
  return (
    <Sonner
      theme={resolved}
      position="top-center"
      offset={76}
      gap={10}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: 'pointer-events-auto flex w-[min(100vw-2rem,24rem)] items-start gap-3 rounded-panel border-3 border-ink bg-card p-4 text-foreground shadow-plastic',
          title: 'font-extrabold leading-snug',
          description: 'mt-0.5 text-sm text-muted-foreground',
          icon: 'mt-0.5 [&_svg]:size-5',
          success: '[&_[data-icon]]:text-green',
          error: '[&_[data-icon]]:text-red',
          info: '[&_[data-icon]]:text-board',
          warning: '[&_[data-icon]]:text-[hsl(var(--on-yellow))]',
          actionButton: '!ml-auto shrink-0 self-center rounded-btn border-2 border-ink bg-yellow px-3 py-1.5 text-sm font-bold text-[hsl(var(--on-yellow))]',
          cancelButton: 'shrink-0 self-center rounded-btn px-2 py-1.5 text-sm font-bold text-muted-foreground hover:text-foreground',
        },
      }}
    />
  )
}
