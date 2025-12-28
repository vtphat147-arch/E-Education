import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Heart, Code2, Layout, Type, Menu, Navigation, Grid } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../cpnents/Header'
import { designService, DesignComponent } from '../services/api'

const Components = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [components, setComponents] = useState<DesignComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    { value: 'all', label: 'Tất cả', icon: Grid },
    { value: 'header', label: 'Headers', icon: Navigation },
    { value: 'footer', label: 'Footers', icon: Menu },
    { value: 'sidebar', label: 'Sidebars', icon: Layout },
    { value: 'layout', label: 'Layouts', icon: Grid },
    { value: 'typography', label: 'Typography', icon: Type },
  ]

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true)
        setError(null)
        const category = selectedCategory === 'all' ? undefined : selectedCategory
        const search = searchTerm.trim() || undefined
        const data = await designService.getAllComponents(category, undefined, search)
        setComponents(data)
      } catch (err) {
        setError('Không thể tải danh sách components')
        console.error('Error fetching components:', err)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchComponents()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Design Components Library
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Tìm kiếm và khám phá hàng nghìn mẫu thiết kế đẹp mắt
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 mb-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm component..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white/50 backdrop-blur-sm transition-all duration-300"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 text-center">
              Tìm thấy <span className="font-semibold text-indigo-600">{components.length}</span> components
            </div>
          </div>
        </div>
      </section>

      {/* Components Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <Code2 className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Lỗi</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : components.length === 0 ? (
            <div className="text-center py-20">
              <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Không tìm thấy component</h3>
              <p className="text-gray-500">Hãy thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {components.map((component, index) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col"
                >
                  {/* Preview Image */}
                  <Link to={`/components/${component.id}`} className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={component.preview}
                      alt={component.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {component.category}
                    </div>
                  </Link>

                  {/* Component Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <Link to={`/components/${component.id}`}>
                      <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900 hover:text-indigo-600 transition-colors">
                        {component.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{component.description}</p>

                    {/* Tags */}
                    {component.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {component.tags.split(',').slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-200 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{component.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{component.likes}</span>
                      </div>
                      {component.framework && (
                        <span className="ml-auto text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                          {component.framework}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Components


