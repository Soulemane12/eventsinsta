import React from 'react'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  className?: string
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-24 w-auto',
    '2xl': 'h-40 w-auto',
    '3xl': 'h-64 w-auto'
  }

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/eventinsta_logo.png"
        alt="EventsInsta"
        width={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 96 : size === '2xl' ? 160 : 256}
        height={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 96 : size === '2xl' ? 160 : 256}
        className={`${sizeClasses[size]} -mt-3`}
        priority
      />
    </div>
  )
}
