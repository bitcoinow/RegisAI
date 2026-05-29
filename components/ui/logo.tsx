interface Props {
  className?: string
  light?: boolean
}

export function RegisLogo({ className, light }: Props) {
  return (
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
}
