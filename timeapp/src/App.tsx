import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Trash from './pages/Trash'
import Timer from './pages/Timer'
import Stats from './pages/Stats'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import { getToken, getCurrentUser, logout } from './services/api'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // 检查认证状态
  function checkAuth() {
    if (getToken()) {
      setIsAuthenticated(true)
      getCurrentUser()
        .then((user) => setCurrentUser(user))
        .catch(() => {
          logout()
          setIsAuthenticated(false)
        })
    } else {
      setIsAuthenticated(false)
      setCurrentUser(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    checkAuth()
    // 监听storage变化，当其他标签页登录时也能检测到
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  // 如果还在加载认证状态，显示加载提示
  if (loading) {
    return <div style={{ padding: '2em', textAlign: 'center' }}>检查认证状态...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Login onLoginSuccess={() => checkAuth()} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Register onRegisterSuccess={() => checkAuth()} />
            )
          }
        />
        {isAuthenticated ? (
          <Route
            path="/*"
            element={
              <div className="app-container">
                <nav className="main-nav">
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.username} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '1rem', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#999', marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>
                        {currentUser?.username?.charAt(0).toUpperCase() || '用'}
                      </div>
                    )}
                    <div>
                      <p style={{ margin: '0', fontWeight: 'bold', color: 'white' }}>{currentUser?.username || '用户'}</p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85em', color: 'rgba(255,255,255,0.7)' }}>{currentUser?.nickname || ''}</p>
                    </div>
                  </div>
                  <Link to="/">仪表盘</Link>
                  <Link to="/tasks">任务</Link>
                  <Link to="/trash">回收站</Link>
                  <Link to="/timer">计时器</Link>
                  <Link to="/stats">统计</Link>
                  <Link to="/settings">设置</Link>
                  <Link to="/profile">个人中心</Link>
                </nav>
                <main className="app-main">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/trash" element={<Trash />} />
                    <Route path="/timer" element={<Timer />} />
                    <Route path="/stats" element={<Stats />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
              </div>
            }
          />
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}
