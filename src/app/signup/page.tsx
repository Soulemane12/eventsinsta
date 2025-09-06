'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const BrandPurple = 'bg-purple-800'
const BrandPurpleHover = 'hover:bg-purple-900'
const BrandText = 'text-purple-800'

function Button({ children, className = '', disabled, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`w-full h-14 rounded-2xl ${BrandPurple} ${BrandPurpleHover} text-white font-semibold disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      {children}
    </label>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 ${props.className ?? ''}`} />
}

function BackBtn() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="w-9 h-9 grid place-items-center rounded-full hover:bg-gray-100" aria-label="Back">
      ←
    </button>
  )
}

export default function SignUp() {
  const router = useRouter()
  const [agree, setAgree] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    email: '',
    password: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = formData.name && formData.phone && formData.dateOfBirth && formData.email && formData.password && agree

  return (
    <div className="max-w-md mx-auto min-h-screen px-6 py-6">
      <div className="flex items-center gap-2">
        <BackBtn />
        <h1 className="text-2xl font-semibold">Sign Up</h1>
      </div>

      <div className="mt-6 space-y-4">
        <Field label="Full Name">
          <Input 
            placeholder="Enter your full name" 
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </Field>
        
        <Field label="Phone Number">
          <Input 
            placeholder="Enter your phone number" 
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </Field>
        
        <Field label="Date of Birth">
          <div className="space-y-2">
            <Input 
              placeholder="MM/DD/YYYY" 
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            />
            <div className="text-xs text-gray-500">
              💡 Tip: You can also type the date manually in MM/DD/YYYY format
            </div>
            <input
              type="text"
              placeholder="MM/DD/YYYY (e.g., 01/15/1990)"
              value={formData.dateOfBirth}
              onChange={(e) => {
                // Allow manual date input with validation
                const value = e.target.value
                // Basic validation for MM/DD/YYYY format
                if (value === '' || /^\d{2}\/\d{2}\/\d{4}$/.test(value) || /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
                  handleInputChange('dateOfBirth', value)
                }
              }}
              className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 text-sm"
            />
          </div>
        </Field>
        
        <Field label="Email">
          <Input 
            placeholder="Enter your email" 
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </Field>
        
        <Field label="Password">
          <Input 
            placeholder="Enter your password" 
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
          />
        </Field>

        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} className="w-4 h-4" />
          <span>I agree to the <a className="text-purple-700 underline" href="#">Terms of Service</a> and <a className="text-purple-700 underline" href="#">Privacy Policy</a>.</span>
        </label>

        <Button onClick={()=>router.push('/home')} disabled={!isFormValid}>Sign Up</Button>
        <div className="text-center text-sm">Already have an account? <Link className="text-purple-700 font-medium" href="/signin">Sign In</Link></div>
        <div className="text-center text-xs text-gray-500">For demo, you can <button onClick={()=>router.push('/home')} className="underline">skip</button>.</div>
      </div>
    </div>
  )
}
