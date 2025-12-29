import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle, AlertCircle } from 'lucide-react'
import Header from '../cpnents/Header'

const PaymentCancel = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Get PayOS cancel URL params (same as returnUrl but with cancel=true)
  const orderCode = searchParams.get('orderCode')
  const payOSStatus = searchParams.get('status') // Usually CANCELLED
  const payOSCode = searchParams.get('code')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertCircle className="w-12 h-12 text-orange-600" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thanh toán đã bị hủy
            </h2>
            
            <p className="text-gray-600 mb-6">
              Bạn đã hủy quá trình thanh toán. Đơn hàng của bạn chưa được xử lý.
            </p>
            
            {orderCode && (
              <div className="bg-gray-100 rounded-lg p-3 mb-4 text-sm text-gray-700">
                <p>Mã đơn hàng: <span className="font-mono font-semibold">{orderCode}</span></p>
                {payOSStatus && (
                  <p className="mt-1">Trạng thái: <span className="font-semibold">{payOSStatus}</span></p>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="font-semibold text-gray-900 mb-2">Bạn có thể:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>Thử thanh toán lại bằng cách chọn gói VIP khác</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>Kiểm tra lại thông tin thanh toán của bạn</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>Liên hệ hỗ trợ nếu cần trợ giúp</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Thử lại thanh toán
            </button>
            <button
              onClick={() => navigate('/components')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Về Trang chủ
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentCancel

