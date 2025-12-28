import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ToastProps {
  message: string
  isOpen: boolean
  onClose: () => void
  duration?: number
}

const Toast = ({ message, isOpen, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[10000] pointer-events-none"
        >
          <div className="bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl border border-gray-700 flex items-center gap-4 min-w-[300px] max-w-[500px] pointer-events-auto">
            <div className="flex-1">
              <p className="font-semibold text-lg">{message}</p>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast

