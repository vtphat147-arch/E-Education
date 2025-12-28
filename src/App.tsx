import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Homepage from './pages/Homepage'
import Homepage3D from './pages/Homepage3D'
import Components from './pages/Components'
import ComponentDetail from './pages/ComponentDetail'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage3D />} />
          <Route path="/classic" element={<Homepage />} />
          <Route path="/components" element={<Components />} />
          <Route path="/components/:id" element={<ComponentDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

