// 格式化日期为 YYYY-MM-DD
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取指定月份的所有日期（包含前后月份的补充日期）
export function getMonthDates(year: number, month: number): number[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const dates: number[] = []

  // 添加前一个月的补充日期
  for (let i = 0; i < startWeekday; i++) {
    dates.push(0)
  }

  // 添加当月日期
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(i)
  }

  // 添加下一个月的补充日期
  const remaining = 42 - dates.length // 6 行 × 7 列
  for (let i = 0; i < remaining; i++) {
    dates.push(0)
  }

  return dates
}

// 比较两个日期是否为同一天
export function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}
