import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { type Task } from '../models/task'
import { getTrashTasks, restoreTask, permanentDeleteTask } from '../services/api'

export default function Trash() {
  const [trashTasks, setTrashTasks] = useState<Task[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrashTasks()
  }, [])

  async function loadTrashTasks() {
    try {
      setLoading(true)
      const data = await getTrashTasks()
      setTrashTasks(data)
      setError('')
    } catch (err: any) {
      setError(err.message || '加载回收站失败')
    } finally {
      setLoading(false)
    }
  }

  async function handleRestore(id: string) {
    if (!window.confirm('确定要恢复此任务吗？')) {
      return
    }
    try {
      await restoreTask(id)
      setTrashTasks((s) => s.filter((t) => t.id !== id))
    } catch (err: any) {
      setError(err.message || '恢复任务失败')
    }
  }

  async function handlePermanentDelete(id: string) {
    if (!window.confirm('确定要永久删除此任务吗？此操作无法撤销。')) {
      return
    }
    try {
      await permanentDeleteTask(id)
      setTrashTasks((s) => s.filter((t) => t.id !== id))
    } catch (err: any) {
      setError(err.message || '永久删除任务失败')
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
        <h2 style={{ margin: 0 }}>回收站</h2>
        <Link to="/tasks" style={{ color: '#2196f3', textDecoration: 'none', fontSize: '0.95em', padding: '0.5em 1em', border: '1px solid #2196f3', borderRadius: '4px', cursor: 'pointer' }}>
          ← 返回任务
        </Link>
      </div>

      {error && (
        <div style={{ padding: '1em', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '1em' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#999' }}>加载中...</p>
      ) : trashTasks.length === 0 ? (
        <div style={{ padding: '2em', backgroundColor: '#f5f5f5', borderRadius: '4px', textAlign: 'center', color: '#999' }}>
          <p>回收站为空，没有已删除的任务</p>
        </div>
      ) : (
        <div>
          <p style={{ color: '#666', fontSize: '0.9em' }}>共有 {trashTasks.length} 个已删除的任务</p>
          <div style={{ display: 'grid', gap: '1em', marginTop: '1em' }}>
            {trashTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  padding: '1em',
                  backgroundColor: '#fff',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5em 0', color: '#666', textDecoration: 'line-through' }}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p style={{ margin: '0.5em 0', fontSize: '0.95em', color: '#888', fontStyle: 'italic' }}>
                        📝 {task.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '1em', flexWrap: 'wrap', marginTop: '0.5em' }}>
                      {task.category && (
                        <span style={{ fontSize: '0.9em', color: '#999' }}>📁 {task.category}</span>
                      )}
                      {task.dueDate && (
                        <span style={{ fontSize: '0.9em', color: '#999' }}>📅 截止: {task.dueDate}</span>
                      )}
                      {task.deletedAt && (
                        <span style={{ fontSize: '0.9em', color: '#d32f2f' }}>
                          🗑️ 删除于: {formatDate(task.deletedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5em', marginLeft: '1em' }}>
                    <button
                      onClick={() => handleRestore(task.id)}
                      style={{
                        padding: '0.4em 0.8em',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9em',
                      }}
                    >
                      恢复
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(task.id)}
                      style={{
                        padding: '0.4em 0.8em',
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9em',
                      }}
                    >
                      永久删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
