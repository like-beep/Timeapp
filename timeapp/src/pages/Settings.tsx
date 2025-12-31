import { useEffect, useState } from 'react'
import { loadSettings, saveSettings, defaultSettings, type Settings as S } from '../services/settings'

export default function Settings() {
  const [settings, setSettings] = useState<S>(defaultSettings)
  const [newMinutes, setNewMinutes] = useState(settings.defaultMinutes)

  useEffect(() => {
    loadSettings().then(savedSettings => {
      setSettings(savedSettings)
    }).catch(error => {
      console.error('加载设置失败:', error)
      // 可以选择保持默认设置或进行其他错误处理
    })
  }, [])

  function update<K extends keyof S>(k: K, v: S[K]) {
    const next = { ...settings, [k]: v }
    setSettings(next)
    saveSettings(next)
  }

  function handleUpdateDefaultMinutes() {
    if (isNaN(newMinutes) || newMinutes <= 0) {
      alert('请输入一个有效的数字')
      return
    }

    const confirmed = window.confirm(`确认修改默认时间为 ${newMinutes} 分钟吗？`)
    if (confirmed) {
      update('defaultMinutes', newMinutes)
    }
  }

  return (
    <div>
      <h2>设置</h2>
      <div>
        <label>主题: </label>
        <select value={settings.theme} onChange={(e) => update('theme', e.target.value as S['theme'])}>
          <option value="light">浅色</option>
          <option value="dark">深色</option>
        </select>
      </div>
      <div>
        <label>默认计时（分钟）: </label>
        <input
          type="number"
          value={newMinutes}
          onChange={(e) => setNewMinutes(Number(e.target.value))}
          min="1"
        />
        <button onClick={handleUpdateDefaultMinutes}>确定修改</button>
      </div>
    </div>
  )
}