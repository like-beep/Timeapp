import React, { useEffect, useState } from 'react'
import TimerComponent from '../components/TimerComponent'
import { getTasks } from '../services/api'
import { type Task } from '../models/task'

export default function Timer() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      setLoading(true)
      const data = await getTasks()
      const activeTasks = data.filter((task: Task) => task.status !== 'done')
      setTasks(activeTasks)
      if (activeTasks.length > 0 && !selectedTask) {
        setSelectedTask(activeTasks[0].id)
      }
    } catch (err) {
      console.error('加载任务失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const currentTask = tasks.find((t) => t.id === selectedTask)

  if (loading) {
    return <div style={{ padding: '2em' }}>加载任务中...</div>
  }

  return (
    <div>
      <h2>计时器</h2>

      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ marginBottom: '2em', padding: '2em', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
          {currentTask ? (
            <>
              <p style={{ margin: '0 0 1em 0', fontSize: '1.2em', color: '#666' }}>当前任务</p>
              <h3 style={{ margin: '0 0 1.5em 0' }}>{currentTask.title}</h3>
            </>
          ) : (
            <p style={{ margin: 0, color: '#999' }}>选择一个任务开始计时</p>
          )}
          <TimerComponent taskName={currentTask?.title} taskId={currentTask?.id} />
        </div>

        {tasks.length > 0 && (
          <div style={{ marginTop: '2em' }}>
            <h3>选择任务</h3>
            <div style={{ display: 'grid', gap: '0.5em' }}>
              {tasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTask(t.id)}
                  style={{
                    padding: '1em',
                    textAlign: 'left',
                    backgroundColor: selectedTask === t.id ? '#e3f2fd' : '#f5f5f5',
                    border: selectedTask === t.id ? '2px solid #2196f3' : '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <strong>{t.title}</strong>
                  {t.category && <p style={{ margin: '0.25em 0 0 0', fontSize: '0.9em', color: '#666' }}>📁 {t.category}</p>}
                </button>
              ))}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div style={{ padding: '2em', textAlign: 'center', color: '#999' }}>
            <p>暂无活跃任务。请先在"任务"页面创建任务。</p>
          </div>
        )}
      </div>
    </div>
  )
}
