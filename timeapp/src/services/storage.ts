import localforage from 'localforage'
import { type Task } from '../models/task'

const TASK_KEY = 'timeapp_tasks_v1'

localforage.config({ name: 'timeapp' })

export async function saveTasks(tasks: Task[]) {
  await localforage.setItem(TASK_KEY, tasks)
}

export async function loadTasks(): Promise<Task[]> {
  const items = await localforage.getItem<Task[]>(TASK_KEY)
  return items || []
}

export async function clearTasks() {
  await localforage.removeItem(TASK_KEY)
}
