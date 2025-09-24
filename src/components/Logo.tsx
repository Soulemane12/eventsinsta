import React from 'react'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-24 w-auto'
  }

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/eventinsta_logo.png"
        alt="EventsInsta"
        width={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 96}
        height={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 96}
        className={`${sizeClasses[size]} -mt-3`}
        priority
      />
    </div>
  )
}
