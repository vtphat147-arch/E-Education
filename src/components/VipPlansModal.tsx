import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { X, Crown, Check, Sparkles, Loader2 } from 'lucide-react'
import { vipService, VipPlan } from '../services/vipService'
import { useVipStatus } from '../hooks/useVipStatus'

interface VipPlansModalProps {
  isOpen: boolean
  onClose: () => void
}

const VipPlansModal = ({ isOpen, onClose }: VipPlansModalProps) => {
  const [plans, setPlans] = useState<VipPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const { vipStatus } = useVipStatus()

  useEffect(() => {
    if (isOpen) {
      loadPlans()
    } else {
      // Reset when closed
      setPlans([])
      setLoadingPlans(true)
    }
  }, [isOpen])

  const loadPlans = async () => {
    try {
      setLoadingPlans(true)
      const data = await vipService.getPlans()
      console.log('Loaded plans:', data)
      setPlans(data)
    } catch (err) {
      console.error('Error loading plans:', err)
      alert('Không thể tải danh sách gói VIP. Vui lòng thử lại sau.')
    } finally {
      setLoadingPlans(false)
    }
  }

  const handleUpgrade = async (plan: VipPlan) => {
    try {
      setLoading(true)
      setSelectedPlanId(plan.id)
      
      const response = await vipService.createOrder(plan.id)
      
      // Redirect to PayOS payment page (includes QR code)
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl
      } else {
        alert('Không thể tạo liên kết thanh toán')
        setLoading(false)
        setSelectedPlanId(null)
      }
    } catch (err: any) {
      console.error('Error creating order:', err)
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng')
      setLoading(false)
      setSelectedPlanId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const calculateSavings = (plan: VipPlan) => {
    if (plan.days === 30) return null
    const monthlyPrice = (plan.price / plan.days) * 30
    const oneMonthPlan = plans.find(p => p.days === 30)
    if (!oneMonthPlan) return null
    const savings = ((oneMonthPlan.price - monthlyPrice) / oneMonthPlan.price) * 100
    return savings > 0 ? Math.round(savings) : null
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
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-6 relative my-8"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-4"
                >
                  <Crown className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Nâng cấp VIP
                </h2>
                <p className="text-gray-600">
                  Chọn gói phù hợp với bạn và trải nghiệm đầy đủ tính năng
                </p>
              </div>

              {/* Current Status */}
              {vipStatus.isVip && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-gray-900">Bạn đang là VIP</span>
                  </div>
                  {vipStatus.daysRemaining !== null && (
                    <p className="text-sm text-gray-600 mt-1">
                      Còn lại {vipStatus.daysRemaining} ngày ({new Date(vipStatus.expiresAt!).toLocaleDateString('vi-VN')})
                    </p>
                  )}
                </div>
              )}

              {/* Plans Grid */}
              {loadingPlans ? (
                <div className="py-12 text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                  <p className="text-gray-600">Đang tải các gói VIP...</p>
                </div>
              ) : plans.length === 0 ? (
                <div className="py-12 text-center bg-gray-50 rounded-xl p-8">
                  <Crown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có gói VIP</h3>
                  <p className="text-gray-600 mb-4">Hiện tại chưa có gói VIP nào khả dụng trong hệ thống.</p>
                  <p className="text-sm text-gray-500 mb-6">
                    Vui lòng đợi admin thiết lập các gói VIP hoặc liên hệ hỗ trợ.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {plans.map((plan, index) => {
                  const savings = calculateSavings(plan)
                  const isSelected = selectedPlanId === plan.id

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative bg-white border-2 rounded-xl p-6 transition-all ${
                        plan.days === 90 ? 'border-amber-500 shadow-lg scale-105' : 'border-gray-200'
                      }`}
                    >
                      {plan.days === 90 && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                          Phổ biến nhất
                        </div>
                      )}

                      {savings && (
                        <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          Tiết kiệm {savings}%
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl font-bold text-gray-900">{formatPrice(plan.price)}</span>
                          <span className="text-gray-600">VNĐ</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatPrice(Math.round(plan.price / plan.days))} VNĐ/ngày
                        </p>
                      </div>

                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Xem tất cả components Premium</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Framework Generator (React, Vue, Angular)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Export ZIP không giới hạn</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Badge VIP trên profile</span>
                        </li>
                      </ul>

                      <button
                        onClick={() => handleUpgrade(plan)}
                        disabled={loading || isSelected}
                        className={`w-full py-3 rounded-lg font-semibold transition-all ${
                          plan.days === 90
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                      >
                        {loading && isSelected ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Đang xử lý...</span>
                          </>
                        ) : (
                          'Nâng cấp ngay'
                        )}
                      </button>
                    </motion.div>
                  )
                  })}
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>Thanh toán an toàn qua PayOS • Hỗ trợ 24/7</p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default VipPlansModal

