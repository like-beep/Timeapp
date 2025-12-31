// 请求浏览器通知权限
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('浏览器不支持通知')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission()
    return perm === 'granted'
  }

  return false
}

// 发送通知
export function sendNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    new Notification(title, options)
  }
}

// 发送计时器完成通知
export function notifyTimerFinished(taskName?: string) {
  sendNotification('计时完成！', {
    body: taskName ? `任务 "${taskName}" 的计时已完成` : '计时器时间已到',
    icon: '/vite.svg',
  })
}

// 发送任务提醒
export function notifyTaskReminder(taskName: string) {
  sendNotification('任务提醒', {
    body: `不要忘记: ${taskName}`,
    icon: '/vite.svg',
  })
}
