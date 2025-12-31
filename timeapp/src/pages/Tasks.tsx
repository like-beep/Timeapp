import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { type Task, type TaskStatus } from '../models/task'
import { getTasks, createTask, updateTask, deleteTask } from '../services/api'

export default function Tasks() {
  const location = useLocation()
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [estimatedMinutes, setEstimatedMinutes] = useState('')
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')
  const [appliedStartDate, setAppliedStartDate] = useState('')
  const [appliedEndDate, setAppliedEndDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasksFromAPI()
    // 如果从日历页跳转过来，获取选中的日期
    if (location.state?.selectedDate) {
      setDueDate(location.state.selectedDate)
      // 自动设置日期过滤器为选中的日期
      setFilterStartDate(location.state.selectedDate)
      setFilterEndDate(location.state.selectedDate)
      // 直接应用这个日期过滤
      setAppliedStartDate(location.state.selectedDate)
      setAppliedEndDate(location.state.selectedDate)
    }
  }, [location.state])

  async function loadTasksFromAPI() {
    try {
      setLoading(true)
      const data = await getTasks()
      setTasks(data)
      setError('')
    } catch (err) {
      setError('无法加载任务')
    } finally {
      setLoading(false)
    }
  }

  async function addTask() {
    if (!title.trim()) {
      setError('任务标题不能为空')
      return
    }

    try {
      const newTask = await createTask(
        title.trim(),
        description || undefined,
        category || undefined,
        dueDate || undefined,
        estimatedMinutes ? Number(estimatedMinutes) : undefined,
        'todo'
      )
      setTasks((s) => [newTask.task, ...s])
      setTitle('')
      setDescription('')
      setCategory('')
      setDueDate('')
      setEstimatedMinutes('')
      setError('')
    } catch (err: any) {
      setError(err.message || '创建任务失败')
    }
  }

  async function updateTaskStatus(id: string, status: TaskStatus) {
    try {
      const task = tasks.find((t) => t.id === id)
      if (!task) return
      await updateTask(id, task.title, task.description, task.category, task.dueDate, task.estimatedMinutes, status)
      setTasks((s) =>
        s.map((t) =>
          t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
        )
      )
    } catch (err: any) {
      setError(err.message || '更新任务失败')
    }
  }

  async function deleteTaskAPI(id: string) {
    if (!window.confirm('确定要删除此任务吗？已删除的任务可在回收站找到。')) {
      return
    }
    try {
      await deleteTask(id)
      setTasks((s) => s.filter((t) => t.id !== id))
    } catch (err: any) {
      setError(err.message || '删除任务失败')
    }
  }

  function handleApplyDateFilter() {
    // 检查日期有效性
    if (filterStartDate && filterEndDate && filterStartDate > filterEndDate) {
      setError('开始日期不能晶于结束日期')
      return
    }
    setAppliedStartDate(filterStartDate)
    setAppliedEndDate(filterEndDate)
    setError('')
  }

  const filteredTasks = tasks.filter((t) => {
    // 状态筛选
    if (filter !== 'all' && t.status !== filter) return false
    // 日期筛选
    if (t.dueDate) {
      if (appliedStartDate && t.dueDate < appliedStartDate) return false
      if (appliedEndDate && t.dueDate > appliedEndDate) return false
    }
    return true
  })
  const categories = Array.from(new Set(tasks.map((t) => t.category).filter(Boolean)))

  const statusLabels: Record<TaskStatus, string> = {
    todo: '待做',
    'in-progress': '进行中',
    done: '已完成',
  }

  const statusColors: Record<TaskStatus, string> = {
    todo: '#ff9800',
    'in-progress': '#2196f3',
    done: '#4caf50',
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
        <h2 style={{ margin: 0 }}>任务管理</h2>
        <Link to="/trash" style={{ color: '#d32f2f', textDecoration: 'none', fontSize: '0.95em', padding: '0.5em 1em', border: '1px solid #d32f2f', borderRadius: '4px', cursor: 'pointer' }}>
          🗑️ 回收站
        </Link>
      </div>

      <div style={{ marginBottom: '2em', padding: '1em', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <h3>创建新任务</h3>
        <div style={{ marginBottom: '1em' }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="任务标题"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="任务简介（可选）"
            style={{ display: 'block', width: '100%', marginBottom: '0.5em', padding: '0.6em', borderRadius: '4px', border: '1px solid #ddd', fontFamily: 'inherit', fontSize: '1em' }}
            rows={2}
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="分类（可选）"
            list="categories"
          />
          <datalist id="categories">
            {categories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="截止日期（可选）"
          />
          <input
            type="number"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(e.target.value)}
            placeholder="预计时长（分钟）"
            min="0"
          />
          <button onClick={addTask}>添加任务</button>
        </div>
      </div>

      <div style={{ marginBottom: '2em' }}>
        <h3>筛选</h3>
        <div style={{ marginBottom: '1em' }}>
          <h4>按状态筛选</h4>
          <div style={{ display: 'flex', gap: '0.5em', flexWrap: 'wrap' }}>
            {(['all', 'todo', 'in-progress', 'done'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  backgroundColor: filter === f ? '#333' : '#f0f0f0',
                  color: filter === f ? 'white' : '#333',
                  border: filter === f ? '1px solid #333' : '1px solid #ddd',
                }}
              >
                {f === 'all' ? '全部' : statusLabels[f as TaskStatus]} ({tasks.filter((t) => (filter === 'all' || t.status === f) && (t.dueDate ? ((!appliedStartDate || t.dueDate >= appliedStartDate) && (!appliedEndDate || t.dueDate <= appliedEndDate)) : true)).length})
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4>按日期筛选</h4>
          {(appliedStartDate || appliedEndDate) && (
            <div style={{ backgroundColor: '#e3f2fd', padding: '0.8em', borderRadius: '4px', marginBottom: '1em', borderLeft: '4px solid #2196f3' }}>
              <strong>📅 已应用日期筛选:</strong> {appliedStartDate} 至 {appliedEndDate || '至今'}
              <br />
              <small style={{ color: '#666' }}>显示该时间段内的任务</small>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '0.5em' }}>
            <div>
              <label>开始日期:</label>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </div>
            <div>
              <label>结束日期:</label>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5em' }}>
              <button onClick={handleApplyDateFilter} style={{ backgroundColor: '#2196f3', color: 'white' }}>确定查询</button>
              <button onClick={() => { 
                setFilterStartDate(''); 
                setFilterEndDate('');
                setAppliedStartDate('');
                setAppliedEndDate('');
              }} style={{ backgroundColor: '#f0f0f0' }}>清除</button>
            </div>
          </div>
        </div>
      </div>

      {error && <div style={{ color: '#d32f2f', marginBottom: '1em', padding: '0.5em', backgroundColor: '#ffebee', borderRadius: '4px' }}>{error}</div>}

      {loading ? (
        <p>加载任务中...</p>
      ) : (
        <div style={{ display: 'grid', gap: '1em' }}>
          {filteredTasks.length === 0 ? (
            <p>暂无任务</p>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: '1em',
                  backgroundColor: 'white',
                borderLeft: `4px solid ${statusColors[t.status]}`,
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5em 0' }}>{t.title}</h4>
                  {t.description && <p style={{ margin: '0.5em 0', fontSize: '0.95em', color: '#555', fontStyle: 'italic' }}>📝 {t.description}</p>}
                  <div style={{ display: 'flex', gap: '1em', flexWrap: 'wrap', marginTop: '0.5em' }}>
                    {t.category && <span style={{ fontSize: '0.9em', color: '#666' }}>📁 {t.category}</span>}
                    {t.dueDate && <span style={{ fontSize: '0.9em', color: '#d32f2f' }}>📅 截止: {t.dueDate}</span>}
                    {t.estimatedMinutes && <span style={{ fontSize: '0.9em', color: '#2196f3' }}>⏱️ 预计: {t.estimatedMinutes} 分钟</span>}
                  </div>
                  <p style={{ margin: '0.5em 0 0 0', fontSize: '0.85em', color: '#999' }}>
                    状态: <span style={{ color: statusColors[t.status] }}>{statusLabels[t.status]}</span>
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5em', marginLeft: '1em' }}>
                  <select
                    value={t.status}
                    onChange={(e) => updateTaskStatus(t.id, e.target.value as TaskStatus)}
                    style={{ padding: '0.4em' }}
                  >
                    <option value="todo">待做</option>
                    <option value="in-progress">进行中</option>
                    <option value="done">已完成</option>
                  </select>
                  <button onClick={() => deleteTaskAPI(t.id)} style={{ color: '#d32f2f' }}>
                    删除
                  </button>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
