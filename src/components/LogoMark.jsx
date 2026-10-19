/** The Connect 4 mark (same drawing as public/favicon.svg). */
export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect x="11" y="54" width="10" height="7" rx="2.5" fill="#1F4FD8" stroke="#0E2A7A" strokeWidth="3" />
      <rect x="43" y="54" width="10" height="7" rx="2.5" fill="#1F4FD8" stroke="#0E2A7A" strokeWidth="3" />
      <rect x="4.5" y="19.5" width="55" height="37" rx="11" fill="#1F4FD8" stroke="#0E2A7A" strokeWidth="3" />
      <circle cx="22" cy="31" r="6.5" fill="#EAF1FF" />
      <circle cx="42" cy="31" r="6.5" fill="#E8333C" stroke="#0E2A7A" strokeWidth="1.5" />
      <circle cx="22" cy="46" r="6.5" fill="#E8333C" stroke="#0E2A7A" strokeWidth="1.5" />
      <circle cx="42" cy="46" r="6.5" fill="#FFC72C" stroke="#0E2A7A" strokeWidth="1.5" />
      <circle cx="22" cy="9.5" r="7.5" fill="#FFC72C" stroke="#0E2A7A" strokeWidth="3" />
    </svg>
  )
}
