import type { ComponentProps } from 'react'

type LoaderProps = {
  label?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'dark' | 'light'
  inline?: boolean
  className?: string
} & ComponentProps<'div'>

const sizeMap = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
}

export function Loader({
  label,
  size = 'md',
  variant = 'dark',
  inline = false,
  className,
  ...rest
}: LoaderProps) {
  const dotClass = [
    'rounded-full',
    'animate-bounce',
    sizeMap[size],
    variant === 'light' ? 'bg-white' : 'bg-gray-900',
  ]
    .filter(Boolean)
    .join(' ')

  const containerClass = ['flex items-center gap-2', inline ? 'justify-start' : 'justify-center', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClass} aria-live="polite" aria-busy="true" {...rest}>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className={dotClass} style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
      {label && <span className="text-sm font-medium text-gray-600">{label}</span>}
    </div>
  )
}

export default Loader
