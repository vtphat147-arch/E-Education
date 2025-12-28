import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Header from '../cpnents/Header'
import ComponentEditor from '../components/ComponentEditor'
import { useAuth } from '../contexts/AuthContext'
import { designService, DesignComponent } from '../services/api'

const ComponentEditorPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [saving, setSaving] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please login to create components</h2>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSave = async (component: Partial<DesignComponent>) => {
    setSaving(true)
    try {
      // For now, just show success - in future, can integrate with API
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Component saved:', component)
      // Navigate to component detail if ID is returned
    } catch (error) {
      throw error
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 pt-28 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ComponentEditor onSave={handleSave} />
        </motion.div>
      </div>
    </div>
  )
}

export default ComponentEditorPage

