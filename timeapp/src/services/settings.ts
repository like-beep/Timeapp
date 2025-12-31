import localforage from 'localforage'

const SETTINGS_KEY = 'timeapp_settings_v1'

export interface Settings {
  theme: 'light' | 'dark'
  defaultMinutes: number
}

export const defaultSettings: Settings = {
  theme: 'light',
  defaultMinutes: 25,
}

export async function loadSettings(): Promise<Settings> {
  const s = await localforage.getItem<Settings>(SETTINGS_KEY)
  return s || defaultSettings
}

export async function saveSettings(s: Settings) {
  await localforage.setItem(SETTINGS_KEY, s)
}
