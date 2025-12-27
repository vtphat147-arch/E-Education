import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export const Card = ({ children, className = '', hover = true }: CardProps) => {
  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 ${className}`}
      whileHover={hover ? { 
        y: -8, 
        scale: 1.02,
        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)'
      } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

