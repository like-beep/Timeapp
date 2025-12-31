import { useEffect, useState } from 'react'
import { getTasks, getSessions } from '../services/api'
import { generateRecommendations, type Recommendation } from '../services/recommendationEngine'

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRecommendations()
  }, [])

  async function loadRecommendations() {
    try {
      setLoading(true)
      setError('')
      const [tasks, sessions] = await Promise.all([getTasks(), getSessions()])
      const recs = await generateRecommendations(tasks, sessions)
      setRecommendations(recs)
    } catch (err: any) {
      setError('无法加载建议')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '1em' }}>加载建议中...</div>

  if (error) return <div style={{ color: '#d32f2f' }}>{error}</div>

  return (
    <div>
      <h3>🎯 时间管理建议</h3>
      {recommendations.length === 0 ? (
        <p style={{ color: '#666' }}>暂无建议，继续保持良好的时间管理习惯！</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {recommendations.map((rec, i) => (
            <li
              key={i}
              style={{
                padding: '1em',
                marginBottom: '0.8em',
                backgroundColor:
                  rec.priority === 'high' ? '#ffebee' : rec.priority === 'medium' ? '#fff3e0' : '#f1f8e9',
                borderLeft: `4px solid ${rec.priority === 'high' ? '#f44336' : rec.priority === 'medium' ? '#ff9800' : '#8bc34a'}`,
                borderRadius: '4px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <strong style={{ fontSize: '1.05em' }}>{rec.title}</strong>
              <p style={{ margin: '0.5em 0 0 0', fontSize: '0.9em', color: '#333' }}>{rec.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
