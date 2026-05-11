interface Props {
  className?: string
}

export function RegisLogo({ className }: Props) {
  return (
    <span className={`relative inline-flex items-baseline font-serif font-black ${className ?? ''}`}>
      {/* Floating accent dot — proportional to font size via em units */}
      <span
        className="absolute bg-green"
        style={{
          width: '0.22em',
          height: '0.22em',
          borderRadius: '50%',
          top: '-0.42em',
          left: '59%',
          transform: 'translateX(-50%)',
        }}
      />
      <span className="text-green tracking-tight">Regis</span>
      <span className="text-gold">.</span>
    </span>
  )
}
