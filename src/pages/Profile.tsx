import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Eye, Edit2, Save, X, Mail, Code2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../cpnents/Header'
import { useAuth } from '../contexts/AuthContext'
import { userService, UserProfile, Favorite, ViewHistoryItem } from '../services/userService'
import { Link } from 'react-router-dom'
import ComponentPreview from '../components/ComponentPreview'

const Profile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [viewHistory, setViewHistory] = useState<ViewHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'history'>('profile')
  const [isEditing, setIsEditing] = useState(false)
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
      const [profileData, favoritesData, historyData] = await Promise.all([
        userService.getProfile(),
        userService.getFavorites(),
        userService.getViewHistory(1, 10)
      ])
      setProfile(profileData)
      setFavorites(favoritesData)
      setViewHistory(historyData.data)
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
                    <h1 className="text-3xl font-bold text-gray-900">{profile?.username}</h1>
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
    </div>
  )
}

export default Profile

