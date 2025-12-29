import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Eye, Edit2, Save, X, Mail, Code2, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../cpnents/Header'
import { useAuth } from '../contexts/AuthContext'
import { userService, UserProfile, Favorite, ViewHistoryItem } from '../services/userService'
import { Link } from 'react-router-dom'
import ComponentPreview from '../components/ComponentPreview'
import { useVipStatus } from '../hooks/useVipStatus'
import VipPlansModal from '../components/VipPlansModal'
import { vipService, Payment } from '../services/vipService'

const Profile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [viewHistory, setViewHistory] = useState<ViewHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'history' | 'vip'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showVipModal, setShowVipModal] = useState(false)
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([])
  const { vipStatus, refreshStatus } = useVipStatus()
  const [editData, setEditData] = useState({
    username: '',
    fullName: '',
    bio: '',
    avatarUrl: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    loadData()
  }, [user, navigate])

  const loadData = async () => {
    try {
      setLoading(true)
      const [profileData, favoritesData, historyData, paymentsData] = await Promise.all([
        userService.getProfile(),
        userService.getFavorites().catch(() => []),
        userService.getViewHistory(1, 10).catch(() => ({ data: [], page: 1, pageSize: 10, total: 0, totalPages: 0 })),
        vipService.getPaymentHistory().catch(() => [])
      ])
      setProfile(profileData)
      setFavorites(favoritesData)
      setViewHistory(historyData?.data || [])
      setPaymentHistory(paymentsData || [])
      setEditData({
        username: profileData.username,
        fullName: profileData.fullName || '',
        bio: profileData.bio || '',
        avatarUrl: profileData.avatarUrl || ''
      })
    } catch (err: any) {
      console.error('Error loading profile data:', err)
      // If viewHistory fails, still show other data
      if (err.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const updated = await userService.updateProfile(editData)
      setProfile(updated)
      setIsEditing(false)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật profile')
    }
  }

  const handleRemoveFavorite = async (componentId: number) => {
    try {
      await userService.removeFavorite(componentId)
      setFavorites(favorites.filter(f => f.componentId !== componentId))
    } catch (err) {
      console.error('Error removing favorite:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <div className="container mx-auto px-4 pt-28 pb-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8 mb-8"
        >
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profile?.username?.[0].toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editData.fullName}
                      onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Lưu
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setEditData({
                          username: profile?.username || '',
                          fullName: profile?.fullName || '',
                          bio: profile?.bio || '',
                          avatarUrl: profile?.avatarUrl || ''
                        })
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-gray-900">{profile?.username}</h1>
                      {vipStatus.isVip && (
                        <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-semibold flex items-center gap-1">
                          <Crown className="w-4 h-4" />
                          VIP
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                  {profile?.fullName && (
                    <p className="text-xl text-gray-600 mb-2">{profile.fullName}</p>
                  )}
                  {profile?.bio && (
                    <p className="text-gray-700 mb-4">{profile.bio}</p>
                  )}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{profile?.email}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'profile'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'favorites'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" />
                Favorites ({favorites.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'history'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                View History
              </div>
            </button>
            <button
              onClick={() => setActiveTab('vip')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'vip'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-4 h-4" />
                VIP
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'favorites' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Chưa có favorites nào</p>
                  </div>
                ) : (
                  favorites.map((favorite) => (
                    <motion.div
                      key={favorite.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all flex flex-col group"
                    >
                      <Link to={`/components/${favorite.componentId}`} className="block">
                        <div className="relative w-full aspect-video overflow-hidden bg-white">
                          {favorite.component.htmlCode && favorite.component.cssCode ? (
                            <>
                              <ComponentPreview
                                htmlCode={favorite.component.htmlCode}
                                cssCode={favorite.component.cssCode}
                                jsCode={favorite.component.jsCode || undefined}
                                name={favorite.component.name}
                                height={160}
                                lazy={true}
                              />
                              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                                {favorite.component.category}
                              </div>
                            </>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <Code2 className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="p-4 flex flex-col flex-1">
                        <Link to={`/components/${favorite.componentId}`}>
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {favorite.component.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                          {favorite.component.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200">
                          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                            {favorite.component.category}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              handleRemoveFavorite(favorite.componentId)
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {viewHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Chưa có lịch sử xem</p>
                  </div>
                ) : (
                  viewHistory.map((item) => (
                    <Link
                      key={item.id}
                      to={`/components/${item.componentId}`}
                      className="block bg-white/80 backdrop-blur-xl rounded-xl p-4 hover:shadow-lg transition-all border border-white/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden relative bg-white">
                          {item.component.htmlCode && item.component.cssCode ? (
                            <ComponentPreview
                              htmlCode={item.component.htmlCode}
                              cssCode={item.component.cssCode}
                              jsCode={item.component.jsCode || undefined}
                              name={item.component.name}
                              height={80}
                              lazy={true}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <Code2 className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.component.name}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.component.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{item.component.category}</span>
                            <span>•</span>
                            <span>{new Date(item.viewedAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {activeTab === 'vip' && (
              <div className="space-y-6">
                {/* Current VIP Status */}
                <div className={`rounded-xl p-6 ${vipStatus.isVip ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200' : 'bg-gray-50 border-2 border-gray-200'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        {vipStatus.isVip ? (
                          <>
                            <Crown className="w-6 h-6 text-amber-600" />
                            <span>Bạn đang là thành viên VIP</span>
                          </>
                        ) : (
                          <>
                            <span>Gói hiện tại: Normal</span>
                          </>
                        )}
                      </h3>
                      {vipStatus.isVip && vipStatus.expiresAt ? (
                        <div className="space-y-1">
                          <p className="text-gray-700">
                            <span className="font-semibold">Hết hạn:</span>{' '}
                            {new Date(vipStatus.expiresAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          {vipStatus.daysRemaining !== null && (
                            <p className="text-amber-600 font-semibold">
                              Còn lại {vipStatus.daysRemaining} ngày
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-600">Chưa có gói VIP</p>
                      )}
                    </div>
                    {!vipStatus.isVip && (
                      <button
                        onClick={() => setShowVipModal(true)}
                        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg shadow-amber-500/30"
                      >
                        Nâng cấp VIP
                      </button>
                    )}
                  </div>
                  
                  {vipStatus.isVip && (
                    <div className="bg-white/50 rounded-lg p-4 mt-4">
                      <p className="font-semibold text-gray-900 mb-2">Quyền lợi VIP:</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Xem tất cả components Premium</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Framework Generator (React, Vue, Angular)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Export ZIP không giới hạn</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Badge VIP trên profile</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Payment History */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Lịch sử thanh toán</h3>
                  {paymentHistory.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">Chưa có lịch sử thanh toán</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paymentHistory.map((payment) => (
                        <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{payment.vipPlan.name}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {new Intl.NumberFormat('vi-VN').format(payment.amount)} VNĐ
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                payment.status === 'completed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : payment.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {payment.status === 'completed' ? 'Hoàn thành' : 
                                 payment.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {!vipStatus.isVip && (
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-2 border-amber-300 rounded-xl p-6 text-center">
                    <Crown className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Nâng cấp VIP ngay hôm nay!</h3>
                    <p className="text-gray-600 mb-4">Trải nghiệm đầy đủ tính năng với gói VIP</p>
                    <button
                      onClick={() => setShowVipModal(true)}
                      className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg shadow-amber-500/30"
                    >
                      Xem các gói VIP
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Thông tin tài khoản</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{profile?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Username</label>
                      <p className="text-gray-900">{profile?.username}</p>
                    </div>
                    {profile?.fullName && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <p className="text-gray-900">{profile.fullName}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Thống kê</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-indigo-600 mb-1">
                        <Heart className="w-5 h-5" />
                        <span className="font-semibold">Favorites</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Eye className="w-5 h-5" />
                        <span className="font-semibold">Đã xem</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{viewHistory.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <VipPlansModal
        isOpen={showVipModal}
        onClose={() => {
          setShowVipModal(false)
          refreshStatus()
          loadData()
        }}
      />
    </div>
  )
}

export default Profile

