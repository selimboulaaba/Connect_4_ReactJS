/** Shared Connect 4 board layout — avoids huge vw cells on mobile. */
export const boardOuter =
  'w-full max-w-[min(calc(100vw-1.25rem),19rem)] sm:max-w-[22rem] md:max-w-lg mx-auto px-1 sm:px-2'
export const boardRow =
  'flex w-full items-stretch justify-center gap-[3px] sm:gap-1.5 md:gap-2'
export const boardCol = 'flex min-w-0 flex-1 basis-0 flex-col touch-manipulation'

export function pieceClass(colorPart, interactiveClass = '') {
  return (
    `${colorPart} aspect-square w-full rounded-full border-2 sm:border-[3px] md:border-4 ${interactiveClass}`.trim()
  )
}
