import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Layout, Type, Menu, Navigation, Grid, Eye, Heart, Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../cpnents/Header'
import { designService, DesignComponent } from '../services/api'

const Homepage = () => {
  const [categories, setCategories] = useState<{ name: string; label: string; icon: any; color: string; components: DesignComponent[] }[]>([])
  const [loading, setLoading] = useState(true)

  const categoryConfig = [
    { name: 'header', label: 'Headers', icon: Navigation, color: 'from-blue-500 to-blue-600' },
    { name: 'footer', label: 'Footers', icon: Menu, color: 'from-purple-500 to-purple-600' },
    { name: 'sidebar', label: 'Sidebars', icon: Layout, color: 'from-green-500 to-green-600' },
    { name: 'layout', label: 'Layouts', icon: Grid, color: 'from-orange-500 to-orange-600' },
    { name: 'typography', label: 'Typography', icon: Type, color: 'from-pink-500 to-pink-600' },
  ]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const categoryData = await Promise.all(
          categoryConfig.map(async (config) => {
            const components = await designService.getAllComponents(config.name)
            return {
              ...config,
              components: components.slice(0, 3) // Lấy 3 component đầu tiên
            }
          })
        )
        setCategories(categoryData)
      } catch (err) {
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              UI/UX Design Components
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Khám phá hàng nghìn mẫu thiết kế đẹp mắt - Headers, Footers, Sidebars, Layouts, Typography
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link 
                to="/components" 
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Xem tất cả
              </Link>
              <Link 
                to="/components?category=header" 
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                Bắt đầu với Headers
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Khám phá theo danh mục
          </h2>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                    <category.icon className="w-8 h-8 mb-2" />
                    <h3 className="text-2xl font-bold">{category.label}</h3>
                    <p className="text-white/90 mt-1">
                      {category.components.length} {category.components.length > 1 ? 'mẫu' : 'mẫu'}
                    </p>
                  </div>

                  {/* Components Preview */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {category.components.map((component) => (
                        <Link
                          key={component.id}
                          to={`/components/${component.id}`}
                          className="block group"
                        >
                          <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-md transition-all duration-300">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {component.name}
                              </h4>
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                                {component.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {component.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{component.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                <span>{component.likes}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* View All Button */}
                    <Link
                      to={`/components?category=${category.name}`}
                      className="block mt-6 text-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                    >
                      Xem tất cả {category.label} →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Code2 className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Code Examples</h3>
              <p className="text-gray-600">
                Xem và copy HTML, CSS, JavaScript code cho mọi component
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Live Preview</h3>
              <p className="text-gray-600">
                Xem trước component trong thời gian thực với preview đẹp mắt
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Grid className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Responsive Design</h3>
              <p className="text-gray-600">
                Tất cả components đều responsive và tối ưu cho mọi thiết bị
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
