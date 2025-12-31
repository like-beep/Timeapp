import { type Task } from '../models/task'
import { type TimerSession } from '../models/session'

export interface Recommendation {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

export async function generateRecommendations(tasks: Task[], sessions: TimerSession[]): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = []

  // 统计过去7天的数据
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const recentSessions = sessions.filter(s => {
    const sessionDate = new Date(s.startTime)
    return sessionDate >= sevenDaysAgo
  })

  const totalSeconds = recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0)
  const totalMinutes = totalSeconds / 60
  const avgDaily = totalMinutes / 7

  // 规则1: 如果每日平均专注时长低于120分钟，建议增加专注时间
  if (avgDaily < 120) {
    recommendations.push({
      title: '📈 增加专注时间',
      description: `你的每日平均专注时长仅为 ${Math.round(avgDaily)} 分钟，建议逐步增加到 120-150 分钟。`,
      priority: 'medium',
    })
  }

  // 规则2: 如果待做任务超过10个，建议优先化任务
  const todoCount = tasks.filter(t => t.status === 'todo').length
  if (todoCount > 10) {
    recommendations.push({
      title: '⚠️ 任务过多，建议优先化',
      description: `你有 ${todoCount} 个待做任务。建议使用优先级标签，关注最重要的任务。`,
      priority: 'high',
    })
  }

  // 规则3: 如果最近7天没有会话记录，建议开始计时
  if (recentSessions.length === 0 && tasks.length > 0) {
    recommendations.push({
      title: '⏱️ 开始使用计时器',
      description: '建议使用计时器来追踪工作时间，帮助建立专注习惯。',
      priority: 'medium',
    })
  }

  // 规则4: 如果有超期任务，建议优先处理
  const overdueCount = tasks.filter(t => {
    if (!t.dueDate) return false
    return new Date(t.dueDate) < today && t.status !== 'done'
  }).length

  if (overdueCount > 0) {
    recommendations.push({
      title: '🚨 有超期任务需要处理',
      description: `你有 ${overdueCount} 个超期任务，建议立即处理以避免进一步延误。`,
      priority: 'high',
    })
  }

  // 规则5: 如果完成率高，给予鼓励
  const doneCount = tasks.filter(t => t.status === 'done').length
  const completionRate = tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0

  if (completionRate >= 70 && tasks.length >= 5) {
    recommendations.push({
      title: '✨ 任务完成率很高',
      description: `恭喜！你的任务完成率达到 ${Math.round(completionRate)}%，继续保持这个良好的势头！`,
      priority: 'low',
    })
  }

  // 规则6: 根据专注时间长度建议番茄钟周期
  if (avgDaily > 240) {
    recommendations.push({
      title: '💡 尝试更短的番茄钟周期',
      description: '你的专注能力很强，可以尝试增加番茄钟周期（如 50 分钟）来提升效率。',
      priority: 'low',
    })
  } else if (avgDaily > 0 && avgDaily < 60) {
    recommendations.push({
      title: '💡 尝试更长的番茄钟周期',
      description: '建议使用 30 分钟或更长的番茄钟周期，有助于建立连贯的工作流。',
      priority: 'low',
    })
  }

  return recommendations
}
