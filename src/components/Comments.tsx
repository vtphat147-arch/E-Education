import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Edit2, Trash2, MoreVertical } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { commentService, Comment } from '../services/commentService'
import { formatDistanceToNow } from 'date-fns'

interface CommentsProps {
  componentId: number
}

const Comments = ({ componentId }: CommentsProps) => {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set())
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadComments()
  }, [componentId, page])

  const loadComments = async () => {
    try {
      setLoading(true)
      const response = await commentService.getComments(componentId, page, 20)
      if (page === 1) {
        setComments(response.data)
      } else {
        setComments(prev => [...prev, ...response.data])
      }
      setTotalPages(response.totalPages)
    } catch (err) {
      console.error('Error loading comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !isAuthenticated) return

    try {
      setSubmitting(true)
      const comment = await commentService.createComment(componentId, {
        content: newComment.trim()
      })
      setComments(prev => [comment, ...prev])
      setNewComment('')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể đăng bình luận')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (commentId: number) => {
    if (!editingContent.trim()) return

    try {
      const updated = await commentService.updateComment(componentId, commentId, {
        content: editingContent.trim()
      })
      setComments(prev =>
        prev.map(c => (c.id === commentId ? updated : c))
      )
      setEditingId(null)
      setEditingContent('')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể cập nhật bình luận')
    }
  }

  const handleDelete = async (commentId: number) => {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return

    try {
      await commentService.deleteComment(componentId, commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa bình luận')
    }
  }

  const canEditOrDelete = (comment: Comment) => {
    return isAuthenticated && user && comment.user.id === user.id
  }

  const toggleMenu = (commentId: number) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Bình luận ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-white/50 backdrop-blur-sm"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-8 text-center">
          <p className="text-gray-700">
            <a href="/login" className="text-indigo-600 font-semibold hover:underline">
              Đăng nhập
            </a>
            {' '}để bình luận
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bình luận...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-5"
                >
                  {editingId === comment.id ? (
                    <div>
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none mb-3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(comment.id)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null)
                            setEditingContent('')
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {comment.user.username?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">
                                {comment.user.fullName || comment.user.username}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(comment.createdAt), {
                                  addSuffix: true
                                })}
                              </span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap break-words">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                        {canEditOrDelete(comment) && (
                          <div className="relative">
                            <button
                              onClick={() => toggleMenu(comment.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            {expandedMenus.has(comment.id) && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => toggleMenu(comment.id)}
                                />
                                <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20 min-w-[120px]">
                                  <button
                                    onClick={() => {
                                      setEditingId(comment.id)
                                      setEditingContent(comment.content)
                                      setExpandedMenus(new Set())
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    Sửa
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDelete(comment.id)
                                      setExpandedMenus(new Set())
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Xóa
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More */}
          {page < totalPages && (
            <div className="text-center mt-6">
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-200 transition-colors"
              >
                Xem thêm bình luận
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Comments

