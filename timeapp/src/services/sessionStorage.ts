import localforage from 'localforage'
import { type TimerSession } from '../models/session'

const SESSION_KEY = 'timeapp_sessions_v1'

export async function saveSessions(sessions: TimerSession[]) {
  await localforage.setItem(SESSION_KEY, sessions)
}

export async function loadSessions(): Promise<TimerSession[]> {
  const items = await localforage.getItem<TimerSession[]>(SESSION_KEY)
  return items || []
}

export async function addSession(session: TimerSession) {
  const sessions = await loadSessions()
  sessions.push(session)
  await saveSessions(sessions)
}

export async function getSessionsByDate(date: string): Promise<TimerSession[]> {
  const sessions = await loadSessions()
  return sessions.filter(s => s.startTime.startsWith(date))
}
