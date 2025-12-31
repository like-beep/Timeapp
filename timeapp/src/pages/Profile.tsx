import { useEffect, useState } from 'react'
import { getCurrentUser, updateProfile, changePassword, logout } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
        setNickname(userData.nickname)
        setAvatar(userData.avatar || '')
      } catch (err) {
        setError('无法加载用户信息')
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  async function handleUpdateProfile() {
    setMessage('')
    setError('')
    try {
      await updateProfile(nickname, avatar)
      setMessage('个人信息更新成功！')
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function handleChangePassword() {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('所有密码字段不能为空')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('新密码不一致')
      return
    }
    if (newPassword.length < 6) {
      setError('新密码至少需要6个字符')
      return
    }

    setMessage('')
    setError('')
    try {
      await changePassword(oldPassword, newPassword)
      setMessage('密码修改成功！')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  if (loading) return <div style={{ padding: '2em' }}>加载中...</div>
  if (!user) return <div style={{ padding: '2em' }}>用户不存在</div>

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2em' }}>
      <h2>个人信息</h2>

      {message && <div style={{ color: '#2e7d32', marginBottom: '1em', padding: '0.5em', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>{message}</div>}
      {error && <div style={{ color: '#d32f2f', marginBottom: '1em', padding: '0.5em', backgroundColor: '#ffebee', borderRadius: '4px' }}>{error}</div>}

      <div style={{ backgroundColor: 'white', padding: '1.5em', borderRadius: '4px', marginBottom: '2em' }}>
        <h3>基本信息</h3>

        <div style={{ marginBottom: '1em' }}>
          <label><strong>用户名:</strong></label>
          <p>{user.username}</p>
        </div>

        <div style={{ marginBottom: '1em' }}>
          <label><strong>邮箱:</strong></label>
          <p>{user.email}</p>
        </div>

        <div style={{ marginBottom: '1em' }}>
          <label>昵称:</label>
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} style={{ width: '100%', marginTop: '0.5em' }} />
        </div>

        <div style={{ marginBottom: '1.5em' }}>
          <label>头像 URL:</label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="输入头像图片URL"
            style={{ width: '100%', marginTop: '0.5em' }}
          />
          {avatar && (
            <div style={{ marginTop: '1em' }}>
              <p><strong>头像预览:</strong></p>
              <img src={avatar} alt="头像" style={{ maxWidth: '150px', borderRadius: '50%' }} />
            </div>
          )}
        </div>

        <button onClick={handleUpdateProfile} style={{ marginRight: '1em' }}>
          保存信息
        </button>
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5em', borderRadius: '4px', marginBottom: '2em' }}>
        <h3>安全设置</h3>

        {!showPasswordForm ? (
          <button onClick={() => setShowPasswordForm(true)}>修改密码</button>
        ) : (
          <div>
            <div style={{ marginBottom: '1em' }}>
              <label>旧密码:</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="输入旧密码"
                style={{ width: '100%', marginTop: '0.5em' }}
              />
            </div>

            <div style={{ marginBottom: '1em' }}>
              <label>新密码:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="输入新密码"
                style={{ width: '100%', marginTop: '0.5em' }}
              />
            </div>

            <div style={{ marginBottom: '1.5em' }}>
              <label>确认新密码:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次输入新密码"
                style={{ width: '100%', marginTop: '0.5em' }}
              />
            </div>

            <button onClick={handleChangePassword} style={{ marginRight: '1em' }}>
              确认修改
            </button>
            <button onClick={() => setShowPasswordForm(false)} style={{ backgroundColor: '#f0f0f0' }}>
              取消
            </button>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5em', borderRadius: '4px' }}>
        <button onClick={handleLogout} style={{ backgroundColor: '#d32f2f', color: 'white' }}>
          退出登录
        </button>
      </div>
    </div>
  )
}
