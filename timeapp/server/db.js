import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, '..', 'data')
const usersFile = path.join(dataDir, 'users.json')
const tasksFile = path.join(dataDir, 'tasks.json')
const sessionsFile = path.join(dataDir, 'sessions.json')

// 确保 data 目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// 初始化数据文件
function initializeFiles() {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2))
  }
  if (!fs.existsSync(tasksFile)) {
    fs.writeFileSync(tasksFile, JSON.stringify([], null, 2))
  }
  if (!fs.existsSync(sessionsFile)) {
    fs.writeFileSync(sessionsFile, JSON.stringify([], null, 2))
  }
  console.log('数据文件已初始化:', dataDir)
}

// 读取用户数据
export function readUsers() {
  const data = fs.readFileSync(usersFile, 'utf-8')
  return JSON.parse(data)
}

// 写入用户数据
export function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
}

// 读取任务数据
export function readTasks() {
  const data = fs.readFileSync(tasksFile, 'utf-8')
  return JSON.parse(data)
}

// 写入任务数据
export function writeTasks(tasks) {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2))
}

// 读取会话数据
export function readSessions() {
  const data = fs.readFileSync(sessionsFile, 'utf-8')
  return JSON.parse(data)
}

// 写入会话数据
export function writeSessions(sessions) {
  fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2))
}

// 查找用户
export function findUser(field, value) {
  const users = readUsers()
  return users.find((u) => u[field] === value)
}

// 查找用户ID
export function findUserById(id) {
  return findUser('id', id)
}

// 添加用户
export function addUser(user) {
  const users = readUsers()
  users.push(user)
  writeUsers(users)
  return user
}

// 更新用户
export function updateUser(id, updates) {
  const users = readUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index !== -1) {
    users[index] = { ...users[index], ...updates }
    writeUsers(users)
    return users[index]
  }
  return null
}

// 获取用户的任务
export function getUserTasks(userId) {
  const tasks = readTasks()
  return tasks.filter((t) => t.userId === userId)
}

// 添加任务
export function addTask(task) {
  const tasks = readTasks()
  tasks.push(task)
  writeTasks(tasks)
  return task
}

// 更新任务
export function updateTask(taskId, updates) {
  const tasks = readTasks()
  const index = tasks.findIndex((t) => t.id === taskId)
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates }
    writeTasks(tasks)
    return tasks[index]
  }
  return null
}

// 软删除任务（移到回收站）
export function deleteTask(taskId) {
  const tasks = readTasks()
  const index = tasks.findIndex((t) => t.id === taskId)
  if (index !== -1) {
    tasks[index] = { ...tasks[index], isDeleted: true, deletedAt: new Date().toISOString() }
    writeTasks(tasks)
  }
}

// 永久删除任务
export function permanentDeleteTask(taskId) {
  const tasks = readTasks()
  const filtered = tasks.filter((t) => t.id !== taskId)
  writeTasks(filtered)
}

// 恢复任务
export function restoreTask(taskId) {
  const tasks = readTasks()
  const index = tasks.findIndex((t) => t.id === taskId)
  if (index !== -1) {
    tasks[index] = { ...tasks[index], isDeleted: false }
    writeTasks(tasks)
  }
}

// 获取用户的会话
export function getUserSessions(userId) {
  const sessions = readSessions()
  return sessions.filter((s) => s.userId === userId)
}

// 添加会话
export function addSession(session) {
  const sessions = readSessions()
  sessions.push(session)
  writeSessions(sessions)
  return session
}

export function initializeDatabase() {
  initializeFiles()
}
