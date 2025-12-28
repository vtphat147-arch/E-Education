import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Homepage from './pages/Homepage'
import Homepage3D from './pages/Homepage3D'
import Components from './pages/Components'
import ComponentDetail from './pages/ComponentDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import VerifyEmail from './pages/VerifyEmail'
import RegisterSuccess from './pages/RegisterSuccess'
import ComponentEditorPage from './pages/ComponentEditorPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Homepage3D />} />
          <Route path="/classic" element={<Homepage />} />
          <Route path="/components" element={<Components />} />
          <Route path="/components/:id" element={<ComponentDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-success" element={<RegisterSuccess />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editor" element={<ComponentEditorPage />} />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

