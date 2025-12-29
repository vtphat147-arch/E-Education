import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { X, Crown, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface VipRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
}

const VipRequiredModal = ({ isOpen, onClose, message }: VipRequiredModalProps) => {
  const navigate = useNavigate()

  const handleUpgrade = () => {
    onClose()
    navigate('/profile?tab=vip')
  }

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-4"
                >
                  <Crown className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Cần tài khoản VIP
                </h3>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                  {message || 'Tính năng này chỉ dành cho thành viên VIP. Nâng cấp ngay để trải nghiệm đầy đủ!'}
                </p>

                {/* Features list */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 mb-6 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-gray-900">Quyền lợi VIP:</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">✓</span>
                      <span>Xem tất cả components Premium</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">✓</span>
                      <span>Framework Generator (React, Vue, Angular)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">✓</span>
                      <span>Export ZIP không giới hạn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">✓</span>
                      <span>Badge VIP trên profile</span>
                    </li>
                  </ul>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleUpgrade}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg shadow-amber-500/30"
                  >
                    Nâng cấp VIP
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default VipRequiredModal

