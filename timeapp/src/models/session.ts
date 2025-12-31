export interface TimerSession {
  id: string
  taskId?: string
  category?: string
  duration: number // seconds
  startTime: string
  endTime: string
  completed: boolean
}
