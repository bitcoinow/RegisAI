import Link from 'next/link'

interface Props {
  className?: string
  light?: boolean
  /** When set, the logo renders as a link (e.g. "/" to go home). */
  href?: string
}

export function RegisLogo({ className, light, href }: Props) {
  const mark = (
    <span className={`relative inline-flex items-baseline font-serif font-black ${className ?? ''}`}>
      <span
        className={`absolute ${light ? 'bg-bg' : 'bg-green'}`}
        style={{
          width: '0.22em',
          height: '0.22em',
          borderRadius: '50%',
          top: '-0.42em',
          left: '59%',
          transform: 'translateX(-50%)',
        }}
      />
      <span className={`tracking-tight ${light ? 'text-bg' : 'text-green'}`}>Regis</span>
      <span className="text-gold">.</span>
    </span>
  )

  if (!href) return mark

  return (
    <Link
      href={href}
      aria-label="Regis AI — home"
      className="inline-flex rounded transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
    >
      {mark}
    </Link>
  )
}
