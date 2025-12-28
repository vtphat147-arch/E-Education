import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

interface DarkModeToggleProps {
  onToggle: (isDark: boolean) => void
}

const DarkModeToggle = ({ onToggle }: DarkModeToggleProps) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    onToggle(isDark)
  }, [isDark, onToggle])

  const toggle = () => {
    setIsDark(!isDark)
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
        isDark ? 'bg-indigo-600' : 'bg-gray-300'
      }`}
      aria-label="Toggle dark mode"
    >
      <motion.div
        initial={false}
        animate={{
          x: isDark ? 24 : 0,
          rotate: isDark ? 180 : 0
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-indigo-600" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  )
}

export default DarkModeToggle


