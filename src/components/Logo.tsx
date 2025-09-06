import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  className?: string
}

export default function Logo({ size = 'md', showTagline = false, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  }

  const taglineSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  return (
    <div className={`text-center ${className}`}>
      <div className={`text-purple-800 font-black tracking-wide ${sizeClasses[size]}`}>
        EVENTSINSTA
      </div>
      {showTagline && (
        <div className={`text-purple-500 tracking-wide mt-1 ${taglineSizeClasses[size]}`}>
          Plan. Create. Celebrate
        </div>
      )}
    </div>
  )
}
