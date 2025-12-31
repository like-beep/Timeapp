import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { getSessions } from '../services/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Stats() {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStatistics()
  }, [])

  async function loadStatistics() {
    try {
      setLoading(true)
      const sessions = await getSessions()
      
      // 计算过去7天的统计数据
      const today = new Date()
      const weekData: Record<string, number> = {}
      const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      
      // 初始化过去7天的数据
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dayName = dayNames[date.getDay()]
        weekData[dayName] = 0
      }
      
      // 累加会话时长
      sessions.forEach((session: any) => {
        const sessionDate = new Date(session.startTime)
        const dayName = dayNames[sessionDate.getDay()]
        
        // 只统计过去7天的数据
        const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff >= 0 && daysDiff < 7) {
          if (weekData[dayName] !== undefined) {
            weekData[dayName] += Math.floor((session.duration || 0) / 60) // 转换为分钟
          }
        }
      })
      
      const labels = Object.keys(weekData)
      const data = Object.values(weekData)
      
      setChartData({
        labels,
        datasets: [
          {
            label: '专注时长（分钟）',
            data,
            backgroundColor: 'rgba(75,192,192,0.6)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
          }
        ]
      })
      setError('')
    } catch (err) {
      setError('无法加载统计数据')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '2em' }}>加载统计数据中...</div>
  }

  if (error) {
    return <div style={{ padding: '2em', color: '#d32f2f' }}>{error}</div>
  }

  return (
    <div>
      <h2>统计</h2>
      <div style={{ maxWidth: 800 }}>
        {chartData && <Bar data={chartData} />}
      </div>
    </div>
  )
}
