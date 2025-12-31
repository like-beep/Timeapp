import { useEffect, useState } from 'react'
import { type Task } from '../models/task'
import { getTasks, getSessions } from '../services/api'
import { type TimerSession } from '../models/session'
import CalendarView from '../components/CalendarView'
import Recommendations from '../components/Recommendations'
import { formatDate } from '../utils/dateUtils'

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [todaySessions, setTodaySessions] = useState<TimerSession[]>([])
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    // 根据选定日期过滤会话
    if (todaySessions && todaySessions.length > 0) {
      const filtered = todaySessions.filter(s => {
        const sessionDate = formatDate(new Date(s.startTime))
        return sessionDate === selectedDate
      })
      setTodaySessions(filtered)
    }
  }, [selectedDate])

  async function loadDashboardData() {
    try {
      setLoading(true)
      setError('')
      const [tasksData, sessionsData] = await Promise.all([getTasks(), getSessions()])
      const activeTasks = tasksData.filter((task: Task) => task.status !== 'done')
      setTasks(activeTasks)
      setTodaySessions(sessionsData as TimerSession[])
    } catch (err) {
      setError('无法加载仪表盘数据')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredSessions = todaySessions.filter(s => {
    const sessionDate = formatDate(new Date(s.startTime))
    return sessionDate === selectedDate
  })

  const todayDuration = filteredSessions.reduce((sum, s) => sum + (s.duration || 0), 0)
  const todayHours = Math.floor(todayDuration / 3600)
  const todayMinutes = Math.floor((todayDuration % 3600) / 60)

  if (loading) {
    return <div style={{ padding: '2em' }}>加载仪表盘中...</div>
  }

  return (
    <div>
      <h2>仪表盘</h2>
      {error && <div style={{ color: '#d32f2f', marginBottom: '1em', padding: '0.5em', backgroundColor: '#ffebee', borderRadius: '4px' }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2em', marginBottom: '2em' }}>
        <div>
          <h3>今日统计</h3>
          <div style={{ padding: '1em', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <p><strong>专注时长:</strong> {todayHours}时 {todayMinutes}分</p>
            <p><strong>活跃任务:</strong> {tasks.length} 项</p>
          </div>

          <h3 style={{ marginTop: '2em' }}>待做任务</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.slice(0, 5).map(t => (
              <li key={t.id} style={{ padding: '0.5em', borderBottom: '1px solid #eee' }}>
                {t.title}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>日历</h3>
          <CalendarView onSelectDate={setSelectedDate} navigateToTasks={true} />
        </div>
      </div>

      <Recommendations />
    </div>
  )
}
