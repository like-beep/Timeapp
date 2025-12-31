import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {
  initializeDatabase,
  readUsers,
  writeUsers,
  readTasks,
  writeTasks,
  readSessions,
  writeSessions,
  findUser,
  findUserById,
  addUser,
  updateUser,
  getUserTasks,
  addTask,
  updateTask,
  deleteTask,
  permanentDeleteTask,
  restoreTask,
  getUserSessions,
  addSession,
} from './db.js'
import { v4 as uuidv4 } from 'uuid'
import { hashPassword, comparePassword, generateToken, authenticateToken } from './auth.js'

const app = express()
const PORT = 3001

// 中间件
app.use(cors())
app.use(bodyParser.json())

// 初始化数据库
initializeDatabase()

// ===== 用户认证 API =====

// 注册
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, nickname } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: '用户名、邮箱和密码不能为空' })
    }

    // 检查用户是否已存在
    if (findUser('username', username) || findUser('email', email)) {
      return res.status(400).json({ error: '用户名或邮箱已存在' })
    }

    const userId = uuidv4()
    const hashedPassword = await hashPassword(password)
    const now = new Date().toISOString()

    const newUser = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      nickname: nickname || username,
      avatar: null,
      createdAt: now,
      updatedAt: now,
    }

    addUser(newUser)

    const token = generateToken(userId)
    res.status(201).json({
      message: '注册成功',
      token,
      user: { id: userId, username, email, nickname: nickname || username },
    })
  } catch (err) {
    console.error('注册错误:', err)
    res.status(500).json({ error: '注册失败' })
  }
})

// 登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' })
    }

    const user = findUser('username', username)
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const passwordMatch = await comparePassword(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const token = generateToken(user.id)
    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
      },
    })
  } catch (err) {
    console.error('登录错误:', err)
    res.status(500).json({ error: '登录失败' })
  }
})

// 获取当前用户信息
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = findUserById(req.userId)
    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }
    const { password, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (err) {
    console.error('获取用户信息错误:', err)
    res.status(500).json({ error: '获取用户信息失败' })
  }
})

// ===== 个人信息管理 API =====

// 更新用户信息
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { nickname, avatar } = req.body

    const now = new Date().toISOString()
    updateUser(req.userId, { nickname, avatar, updatedAt: now })

    const user = findUserById(req.userId)
    const { password, ...userWithoutPassword } = user
    res.json({ message: '个人信息更新成功', user: userWithoutPassword })
  } catch (err) {
    console.error('更新用户信息错误:', err)
    res.status(500).json({ error: '更新失败' })
  }
})

// 修改密码
app.post('/api/user/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: '旧密码和新密码不能为空' })
    }

    const user = findUserById(req.userId)
    const passwordMatch = await comparePassword(oldPassword, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: '旧密码错误' })
    }

    const hashedPassword = await hashPassword(newPassword)
    updateUser(req.userId, { password: hashedPassword })

    res.json({ message: '密码修改成功' })
  } catch (err) {
    console.error('修改密码错误:', err)
    res.status(500).json({ error: '修改密码失败' })
  }
})

// ===== 任务管理 API =====

// 创建任务
app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, dueDate, estimatedMinutes, status } = req.body

    if (!title) {
      return res.status(400).json({ error: '任务标题不能为空' })
    }

    const taskId = uuidv4()
    const now = new Date().toISOString()

    const newTask = {
      id: taskId,
      userId: req.userId,
      title,
      description,
      category,
      dueDate,
      estimatedMinutes,
      status: status || 'todo',
      createdAt: now,
      updatedAt: now,
    }

    addTask(newTask)
    res.status(201).json({ message: '任务创建成功', task: newTask })
  } catch (err) {
    console.error('创建任务错误:', err)
    res.status(500).json({ error: '创建任务失败' })
  }
})

// 获取用户的所有任务（不包括已删除的）
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = getUserTasks(req.userId).filter(t => !t.isDeleted)
    res.json(tasks)
  } catch (err) {
    console.error('获取任务错误:', err)
    res.status(500).json({ error: '获取任务失败' })
  }
})

// 更新任务
app.put('/api/tasks/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params
    const { title, description, category, dueDate, estimatedMinutes, status } = req.body

    const tasks = readTasks()
    const task = tasks.find((t) => t.id === taskId && t.userId === req.userId)
    if (!task) {
      return res.status(404).json({ error: '任务不存在' })
    }

    const now = new Date().toISOString()
    const updatedTask = updateTask(taskId, {
      title: title || task.title,
      description,
      category,
      dueDate,
      estimatedMinutes,
      status: status || task.status,
      updatedAt: now,
    })

    res.json({ message: '任务更新成功', task: updatedTask })
  } catch (err) {
    console.error('更新任务错误:', err)
    res.status(500).json({ error: '更新任务失败' })
  }
})

// 删除任务（移到回收站）
app.delete('/api/tasks/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params

    const tasks = readTasks()
    const task = tasks.find((t) => t.id === taskId && t.userId === req.userId)
    if (!task) {
      return res.status(404).json({ error: '任务不存在' })
    }

    deleteTask(taskId)
    res.json({ message: '任务已移到回收站' })
  } catch (err) {
    console.error('删除任务错误:', err)
    res.status(500).json({ error: '删除任务失败' })
  }
})

// 获取用户的回收站任务
app.get('/api/trash', authenticateToken, async (req, res) => {
  try {
    const tasks = getUserTasks(req.userId).filter(t => t.isDeleted)
    res.json(tasks)
  } catch (err) {
    console.error('获取回收站任务错误:', err)
    res.status(500).json({ error: '获取回收站任务失败' })
  }
})

// 恢复任务
app.put('/api/tasks/:taskId/restore', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params

    const tasks = readTasks()
    const task = tasks.find((t) => t.id === taskId && t.userId === req.userId)
    if (!task) {
      return res.status(404).json({ error: '任务不存在' })
    }

    if (!task.isDeleted) {
      return res.status(400).json({ error: '任务未被删除' })
    }

    restoreTask(taskId)
    res.json({ message: '任务已恢复' })
  } catch (err) {
    console.error('恢复任务错误:', err)
    res.status(500).json({ error: '恢复任务失败' })
  }
})

// 永久删除任务
app.delete('/api/trash/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params

    const tasks = readTasks()
    const task = tasks.find((t) => t.id === taskId && t.userId === req.userId)
    if (!task) {
      return res.status(404).json({ error: '任务不存在' })
    }

    if (!task.isDeleted) {
      return res.status(400).json({ error: '任务未被删除' })
    }

    permanentDeleteTask(taskId)
    res.json({ message: '任务已永久删除' })
  } catch (err) {
    console.error('永久删除任务错误:', err)
    res.status(500).json({ error: '永久删除任务失败' })
  }
})

// ===== 计时会话 API =====

// 创建计时会话
app.post('/api/sessions', authenticateToken, async (req, res) => {
  try {
    const { taskId, duration, startTime, endTime } = req.body

    const sessionId = uuidv4()
    const newSession = {
      id: sessionId,
      userId: req.userId,
      taskId,
      duration,
      startTime,
      endTime,
      completed: true,
    }

    addSession(newSession)
    res.status(201).json({ message: '会话创建成功', session: newSession })
  } catch (err) {
    console.error('创建会话错误:', err)
    res.status(500).json({ error: '创建会话失败' })
  }
})

// 获取用户的所有会话
app.get('/api/sessions', authenticateToken, async (req, res) => {
  try {
    const sessions = getUserSessions(req.userId)
    res.json(sessions)
  } catch (err) {
    console.error('获取会话错误:', err)
    res.status(500).json({ error: '获取会话失败' })
  }
})

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TimeApp API 运行中' })
})

app.listen(PORT, () => {
  console.log(`时间管理 API 服务运行于 http://localhost:${PORT}`)
})
