import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Crown } from 'lucide-react'
import Header from '../cpnents/Header'
import { vipService } from '../services/vipService'
import { useAuth } from '../contexts/AuthContext'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [vipStatus, setVipStatus] = useState<any>(null)
  
  // Get PayOS return URL params
  const orderCode = searchParams.get('orderCode')
  const payOSCode = searchParams.get('code') // "00" = success
  const payOSStatus = searchParams.get('status') // PAID, PENDING, PROCESSING, CANCELLED
  const isCancel = searchParams.get('cancel') === 'true'
  const paymentLinkId = searchParams.get('id')

  useEffect(() => {
    const verifyPayment = async () => {
      // Check PayOS return URL params first
      if (isCancel || payOSStatus === 'CANCELLED') {
        setStatus('failed')
        return
      }

      if (!orderCode) {
        setStatus('failed')
        return
      }

      // If PayOS indicates success (code=00 and status=PAID), mark as success immediately
      if (payOSCode === '00' && payOSStatus === 'PAID') {
        try {
          const vipStatusData = await vipService.getVipStatus()
          setVipStatus(vipStatusData)
          await refreshUser()
          setStatus('success')
          return
        } catch (err) {
          console.error('Error getting VIP status:', err)
          // Continue with verification below
        }
      }

      try {
        // Try to verify payment immediately (webhook might have already processed it)
        try {
          const result = await vipService.verifyPayment(orderCode)
          
          if (result.status === 'completed') {
            setStatus('success')
            const vipStatusData = await vipService.getVipStatus()
            setVipStatus(vipStatusData)
            
            // Refresh user context immediately
            await refreshUser()
            return
          } else if (result.status === 'cancelled' || result.status === 'failed') {
            setStatus('failed')
            return
          }
        } catch (err) {
          // If first attempt fails, try polling (webhook might be processing)
          console.log('First verification attempt failed, starting polling...')
        }

        // Poll for payment status (only if first attempt didn't succeed)
        let attempts = 0
        const maxAttempts = 5 // Reduced from 20 to 5 (10 seconds max)
        const pollInterval = 2000 // 2 seconds
        let pollTimer: ReturnType<typeof setTimeout> | null = null

        const poll = async () => {
          try {
            const result = await vipService.verifyPayment(orderCode)
            
            if (result.status === 'completed') {
              setStatus('success')
              const vipStatusData = await vipService.getVipStatus()
              setVipStatus(vipStatusData)
              
              // Stop polling
              if (pollTimer) clearTimeout(pollTimer)
              
              // Refresh user context immediately
              await refreshUser()
              return
            } else if (result.status === 'cancelled' || result.status === 'failed') {
              setStatus('failed')
              if (pollTimer) clearTimeout(pollTimer)
              return
            }

            attempts++
            if (attempts < maxAttempts) {
              pollTimer = setTimeout(poll, pollInterval)
            } else {
              // After max attempts, check status one more time
              try {
                const finalResult = await vipService.verifyPayment(orderCode)
                if (finalResult.status === 'completed') {
                  setStatus('success')
                  const vipStatusData = await vipService.getVipStatus()
                  setVipStatus(vipStatusData)
                  await refreshUser()
                } else {
                  setStatus('failed')
                }
              } catch (err) {
                setStatus('failed')
              }
            }
          } catch (err) {
            console.error('Error verifying payment:', err)
            attempts++
            if (attempts < maxAttempts) {
              pollTimer = setTimeout(poll, pollInterval)
            } else {
              setStatus('failed')
            }
          }
        }

        // Start polling after a short delay
        pollTimer = setTimeout(poll, pollInterval)
        
        // Cleanup on unmount
        return () => {
          if (pollTimer) clearTimeout(pollTimer)
        }
      } catch (err) {
        console.error('Error verifying payment:', err)
        setStatus('failed')
      }
    }

    verifyPayment()
  }, [orderCode, payOSCode, payOSStatus, isCancel, refreshUser])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          {status === 'loading' && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Đang xác thực thanh toán...
              </h2>
              <p className="text-gray-600">
                Vui lòng đợi trong giây lát
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full mb-4">
                  <Crown className="w-5 h-5" />
                  <span className="font-semibold">Nâng cấp VIP thành công!</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Chúc mừng bạn đã trở thành thành viên VIP
                </h2>
                
                {vipStatus?.expiresAt && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 mb-6">
                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">VIP có hiệu lực đến:</span>
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                      {new Date(vipStatus.expiresAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {vipStatus.daysRemaining !== null && (
                      <p className="text-sm text-gray-600 mt-2">
                        Còn lại {vipStatus.daysRemaining} ngày
                      </p>
                    )}
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <p className="font-semibold text-gray-900 mb-2">Bạn đã có quyền truy cập:</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Xem tất cả components Premium</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Framework Generator (React, Vue, Angular)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Export ZIP không giới hạn</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Badge VIP trên profile</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/components')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Khám phá Components
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Xem Profile
                </button>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <XCircle className="w-12 h-12 text-red-600" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Xác thực thanh toán thất bại
              </h2>
              <p className="text-gray-600 mb-6">
                Không thể xác thực thanh toán. Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ.
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/profile')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Quay lại Profile
                </button>
                <button
                  onClick={() => navigate('/components')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Về Trang chủ
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentSuccess

