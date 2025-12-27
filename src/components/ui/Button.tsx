import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'glow'
  className?: string
}

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '' 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
    secondary: 'bg-white/10 backdrop-blur-md border border-white/20 text-white',
    glow: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_30px_rgba(102,126,234,0.5)]'
  }

  return (
    <motion.button
      onClick={onClick}
      className={`px-8 py-4 rounded-xl font-semibold text-lg ${variants[variant]} ${className}`}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)'
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  )
}

