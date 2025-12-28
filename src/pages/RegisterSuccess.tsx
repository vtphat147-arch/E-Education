import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, ArrowRight, Copy, Check } from 'lucide-react'
import Header from '../cpnents/Header'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const RegisterSuccess = () => {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const email = location.state?.email || 'email của bạn'
  const [verificationLink, setVerificationLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Try to get verification link if user is authenticated
    if (isAuthenticated) {
      fetchVerificationLink()
    }
  }, [isAuthenticated])

  const fetchVerificationLink = async () => {
    try {
      setLoading(true)
      const baseURL = import.meta.env.VITE_API_URL || 'https://e-education-be.onrender.com/api'
      const token = localStorage.getItem('auth_token')
      
      if (token) {
        const response = await axios.get(`${baseURL}/emailverification/link`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.data.verificationLink) {
          setVerificationLink(response.data.verificationLink)
        }
      }
    } catch (err) {
      console.error('Error fetching verification link:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (verificationLink) {
      navigator.clipboard.writeText(verificationLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký thành công!</h1>
            <p className="text-gray-600 mb-6">
              Chúng tôi đã gửi email xác thực đến <span className="font-semibold text-gray-900">{email}</span>
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 mb-1">Vui lòng kiểm tra email của bạn</p>
                  <p className="text-sm text-blue-800 mb-3">
                    Click vào link trong email để xác thực tài khoản. Link sẽ hết hạn sau 24 giờ.
                  </p>
                  
                  {/* Show verification link if available (SMTP not configured) */}
                  {verificationLink && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900 mb-2">Hoặc dùng link này (nếu chưa nhận email):</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={verificationLink}
                          readOnly
                          className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg font-mono"
                        />
                        <button
                          onClick={copyToClipboard}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          title="Copy link"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <a
                        href={verificationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-700 underline"
                      >
                        Mở link xác thực
                      </a>
                    </div>
                  )}
                  
                  {loading && (
                    <p className="text-xs text-blue-600 mt-2">Đang tải verification link...</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/login"
                className="block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Đăng nhập ngay
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500">
                Bạn có thể đăng nhập ngay, nhưng một số tính năng sẽ bị hạn chế cho đến khi xác thực email.
              </p>
            </div>
          </div>

          {/* Help section */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
            <p className="font-semibold mb-2">Không nhận được email?</p>
            <ul className="text-left space-y-1 list-disc list-inside">
              <li>Kiểm tra thư mục spam/junk</li>
              <li>Đợi vài phút, email có thể đến chậm</li>
              <li>Đảm bảo địa chỉ email chính xác</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterSuccess

