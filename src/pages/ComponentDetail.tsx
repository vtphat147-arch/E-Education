import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, Heart, Copy, Check, ExternalLink, Sparkles } from 'lucide-react'
import Header from '../cpnents/Header'
import { designService, DesignComponent } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/userService'

const ComponentDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [component, setComponent] = useState<DesignComponent | null>(null)
  const [relatedComponents, setRelatedComponents] = useState<DesignComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html')
  const [copied, setCopied] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchComponent = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await designService.getComponentById(parseInt(id))
        setComponent(data)
        
        // Check if favorited (if authenticated)
        if (isAuthenticated && data.id) {
          try {
            const favorited = await userService.checkFavorite(data.id)
            setIsFavorited(favorited)
          } catch (err) {
            // Silent fail
          }
        }
        
        // Fetch related components cùng category
        if (data.category) {
          const related = await designService.getAllComponents(data.category)
          // Loại bỏ component hiện tại và lấy tối đa 4 components
          const filtered = related
            .filter(c => c.id !== data.id)
            .slice(0, 4)
          setRelatedComponents(filtered)
        }
      } catch (err) {
        console.error('Error fetching component:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchComponent()
  }, [id, isAuthenticated])

  const handleLike = async () => {
    if (!id || !component) return
    try {
      const result = await designService.likeComponent(parseInt(id))
      setComponent({ ...component, likes: result.likes })
    } catch (err) {
      console.error('Error liking component:', err)
    }
  }

  const handleFavorite = async () => {
    if (!id || !isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      if (isFavorited) {
        await userService.removeFavorite(parseInt(id))
        setIsFavorited(false)
      } else {
        await userService.addFavorite(parseInt(id))
        setIsFavorited(true)
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  const handleCopy = async (code: string, type: string) => {
    await navigator.clipboard.writeText(code)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const getCodeByTab = () => {
    if (!component) return ''
    switch (activeTab) {
      case 'html':
        return component.htmlCode
      case 'css':
        return component.cssCode
      case 'js':
        return component.jsCode || '// No JavaScript code'
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!component) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Component không tồn tại</h2>
            <Link to="/components" className="text-primary-600 hover:underline">
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 pt-28 pb-8">
        {/* Back Button với glass effect */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-300 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
        </motion.div>

        {/* Component Title & Info - Full width trên cùng */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {component.name}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">{component.description}</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg">
                  {component.category}
                </span>
                <span className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-full text-sm font-medium">
                  {component.type}
                </span>
                {component.framework && (
                  <span className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full text-sm font-semibold shadow-lg">
                    {component.framework}
                  </span>
                )}
                {component.tags && (
                  <>
                    {component.tags.split(',').slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>
            {/* Stats */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleLike}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 font-semibold transition-colors"
              >
                <Heart className={`w-5 h-5 ${component.likes > 0 ? 'fill-red-600' : ''}`} />
                <span>{component.likes}</span>
              </motion.button>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl text-blue-600 font-semibold">
                <Eye className="w-5 h-5" />
                <span>{component.views}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Preview (Left) & Code (Right) */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <h3 className="ml-3 text-lg font-bold text-gray-900">Live Preview</h3>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-100 via-gray-50 to-white">
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <style>${component.cssCode}</style>
                      </head>
                      <body style="margin: 0; padding: 20px;">
                        ${component.htmlCode}
                        ${component.jsCode ? `<script>${component.jsCode}</script>` : ''}
                      </body>
                    </html>
                  `}
                  className="w-full h-[600px] border-2 border-gray-200 rounded-xl bg-white shadow-inner"
                  title="Component Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </motion.div>

          {/* Stats với Favorite button */}
          <div className="flex items-center gap-4 mt-4">
            <motion.button
              onClick={handleLike}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 font-semibold transition-colors"
            >
              <Heart className={`w-5 h-5 ${component.likes > 0 ? 'fill-red-600' : ''}`} />
              <span>{component.likes}</span>
            </motion.button>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl text-blue-600 font-semibold">
              <Eye className="w-5 h-5" />
              <span>{component.views}</span>
            </div>
            {isAuthenticated && (
              <motion.button
                onClick={handleFavorite}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
                  isFavorited
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-indigo-600' : ''}`} />
                <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
              </motion.button>
            )}
          </div>

          {/* Right: Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Code Tabs */}
            <div className="border-b border-gray-200/50 bg-gray-50/50 backdrop-blur-sm flex">
              {(['html', 'css', 'js'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? 'text-indigo-600 border-b-3 border-indigo-600 bg-white/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/30'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Code Display */}
            <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-[600px] max-h-[600px] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-400 text-sm">Code Editor</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopy(getCodeByTab(), activeTab)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm font-medium border border-gray-700"
                >
                  {copied === activeTab ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </motion.button>
              </div>
              <pre className="text-gray-300 text-sm font-mono leading-relaxed">
                <code>{getCodeByTab()}</code>
              </pre>
            </div>
          </motion.div>
        </div>

        {/* Related Components - Chỉ cùng category */}
        {relatedComponents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                More {component.category.charAt(0).toUpperCase() + component.category.slice(1)} Components
              </h2>
              <Link
                to={`/components?category=${component.category}`}
                className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2 transition-colors"
              >
                Xem tất cả <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedComponents.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Link
                    to={`/components/${related.id}`}
                    className="block bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      <img
                        src={related.preview}
                        alt={related.name}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {related.category}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {related.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{related.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{related.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{related.likes}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ComponentDetail
