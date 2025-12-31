export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  category?: string
  tags?: string[]
  dueDate?: string
  estimatedMinutes?: number
  status: TaskStatus
  createdAt: string
  updatedAt?: string
  isDeleted?: boolean
  deletedAt?: string
}
