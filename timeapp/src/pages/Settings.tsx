import { useEffect, useState } from 'react'
import { loadSettings, saveSettings, defaultSettings, type Settings as S } from '../services/settings'

export default function Settings() {
  const [settings, setSettings] = useState<S>(defaultSettings)

  useEffect(() => {
    loadSettings().then(setSettings)
  }, [])

  function update<K extends keyof S>(k: K, v: S[K]) {
    const next = { ...settings, [k]: v }
    setSettings(next)
    saveSettings(next)
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
        <input type="number" value={settings.defaultMinutes} onChange={(e) => update('defaultMinutes', Number(e.target.value))} />
      </div>
    </div>
  )
}
