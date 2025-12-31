import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'

export default function Login({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!username || !password) {
      setError('用户名和密码不能为空')
      return
    }

    setLoading(true)
    setError('')
    try {
      await login(username, password)
      // 调用回调函数更新父组件的认证状态
      if (onLoginSuccess) {
        onLoginSuccess()
      }
      // 导航到主页
      navigate('/')
    } catch (err: any) {
      setError(err.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '2em' }}>
      <h1>时间管理 App - 登录</h1>
      {error && <div style={{ color: '#d32f2f', marginBottom: '1em', padding: '0.5em', backgroundColor: '#ffebee', borderRadius: '4px' }}>{error}</div>}

      <div style={{ marginBottom: '1em' }}>
        <label>用户名:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="输入用户名"
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', marginTop: '0.5em' }}
        />
      </div>

      <div style={{ marginBottom: '1.5em' }}>
        <label>密码:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="输入密码"
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', marginTop: '0.5em' }}
        />
      </div>

      <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '0.8em', marginBottom: '1em' }}>
        {loading ? '登录中...' : '登录'}
      </button>

      <p style={{ textAlign: 'center' }}>
        还没有账户？ <Link to="/register" style={{ color: '#0066cc' }}>立即注册</Link>
      </p>
    </div>
  )
}
