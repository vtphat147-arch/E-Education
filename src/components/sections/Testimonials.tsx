import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Card } from '../ui/Card'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Nguyễn Văn A',
    role: 'Frontend Developer',
    content: 'Thư viện components này giúp tôi tiết kiệm rất nhiều thời gian. Các animations cực kỳ mượt mà!'
  },
  {
    name: 'Trần Thị B',
    role: 'UI/UX Designer',
    content: 'Design system hoàn hảo với nhiều mẫu đẹp. Tôi thích nhất phần 3D effects!'
  },
  {
    name: 'Lê Văn C',
    role: 'Full Stack Developer',
    content: 'Code clean, dễ customize và performance tốt. Highly recommended!'
  }
]

export const Testimonials = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Wave Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 px-4"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight pb-4" style={{ paddingBottom: '0.5rem', lineHeight: '1.15' }}>
            Khách hàng nói gì
          </h2>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Những feedback từ developers và designers đã sử dụng
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30, rotateY: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card hover className="h-full">
                <Quote className="w-8 h-8 text-indigo-400 mb-4" />
                <p className="text-white/90 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="border-t border-white/10 pt-4">
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

