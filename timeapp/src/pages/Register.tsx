import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'

export default function Register({ onRegisterSuccess }: { onRegisterSuccess?: () => void }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!username || !email || !password) {
      setError('用户名、邮箱和密码不能为空')
      return
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符')
      return
    }

    setLoading(true)
    setError('')
    try {
      await register(username, email, password, nickname)
      // 调用回调函数更新父组件的认证状态
      if (onRegisterSuccess) {
        onRegisterSuccess()
      }
      // 导航到主页
      navigate('/')
    } catch (err: any) {
      setError(err.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '30px auto', padding: '2em' }}>
      <h1>时间管理 App - 注册</h1>
      {error && <div style={{ color: '#d32f2f', marginBottom: '1em', padding: '0.5em', backgroundColor: '#ffebee', borderRadius: '4px' }}>{error}</div>}

      <div style={{ marginBottom: '1em' }}>
        <label>用户名:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="输入用户名"
          style={{ width: '100%', marginTop: '0.5em' }}
        />
      </div>

      <div style={{ marginBottom: '1em' }}>
        <label>邮箱:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="输入邮箱"
          style={{ width: '100%', marginTop: '0.5em' }}
        />
      </div>

      <div style={{ marginBottom: '1em' }}>
        <label>昵称（可选）:</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="输入昵称"
          style={{ width: '100%', marginTop: '0.5em' }}
        />
      </div>

      <div style={{ marginBottom: '1em' }}>
        <label>密码:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="输入密码（至少6个字符）"
          style={{ width: '100%', marginTop: '0.5em' }}
        />
      </div>

      <div style={{ marginBottom: '1.5em' }}>
        <label>确认密码:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="再次输入密码"
          style={{ width: '100%', marginTop: '0.5em' }}
        />
      </div>

      <button onClick={handleRegister} disabled={loading} style={{ width: '100%', padding: '0.8em', marginBottom: '1em' }}>
        {loading ? '注册中...' : '注册'}
      </button>

      <p style={{ textAlign: 'center' }}>
        已有账户？ <Link to="/login" style={{ color: '#0066cc' }}>立即登录</Link>
      </p>
    </div>
  )
}
