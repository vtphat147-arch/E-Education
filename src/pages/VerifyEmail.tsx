import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, XCircle, Loader } from 'lucide-react'
import Header from '../cpnents/Header'
import axios from 'axios'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const token = searchParams.get('token')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Token xác thực không hợp lệ')
        return
      }

      try {
        const baseURL = import.meta.env.VITE_API_URL || 'https://e-education-be.onrender.com/api'
        const response = await axios.post(`${baseURL}/auth/verify-email?token=${token}`)
        
        if (response.status === 200) {
          setStatus('success')
          setMessage('Email đã được xác thực thành công!')
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login')
          }, 3000)
        }
      } catch (err: any) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn')
      }
    }

    verifyEmail()
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
            {status === 'loading' && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Đang xác thực email...</h1>
                <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác thực thành công!</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Đang chuyển đến trang đăng nhập...
                </p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Đăng nhập ngay
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác thực thất bại</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-3">
                  <Link
                    to="/register"
                    className="block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Đăng ký lại
                  </Link>
                  <Link
                    to="/login"
                    className="block px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                  >
                    Đăng nhập
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Info box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold mb-1">Không nhận được email?</p>
                <p>Kiểm tra thư mục spam hoặc đăng ký lại với email khác.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VerifyEmail


