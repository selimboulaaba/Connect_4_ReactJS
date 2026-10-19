// Joins class names, skipping falsy values.
export const cn = (...classes) => classes.filter(Boolean).join(' ')
