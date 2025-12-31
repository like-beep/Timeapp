const API_BASE_URL = '/api'

// 存储token的工具函数
export function getToken(): string | null {
  return localStorage.getItem('authToken')
}

export function setToken(token: string): void {
  localStorage.setItem('authToken', token)
}

export function removeToken(): void {
  localStorage.removeItem('authToken')
}

// 发送API请求的通用函数
async function apiRequest(endpoint: string, options: any = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const headers: any = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '请求失败')
  }

  return response.json()
}

// ===== 认证 API =====

export async function register(username: string, email: string, password: string, nickname: string) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, nickname }),
  })
  if (data.token) {
    setToken(data.token)
  }
  return data
}

export async function login(username: string, password: string) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  if (data.token) {
    setToken(data.token)
  }
  return data
}

export function logout() {
  removeToken()
}

export async function getCurrentUser() {
  return apiRequest('/auth/me')
}

// ===== 用户信息 API =====

export async function updateProfile(nickname: string, avatar: string) {
  return apiRequest('/user/profile', {
    method: 'PUT',
    body: JSON.stringify({ nickname, avatar }),
  })
}

export async function changePassword(oldPassword: string, newPassword: string) {
  return apiRequest('/user/change-password', {
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword }),
  })
}

// ===== 任务 API =====

export async function createTask(title: string, description?: string, category?: string, dueDate?: string, estimatedMinutes?: number, status?: string) {
  return apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, description, category, dueDate, estimatedMinutes, status }),
  })
}

export async function getTasks() {
  return apiRequest('/tasks')
}

export async function updateTask(taskId: string, title: string, description?: string, category?: string, dueDate?: string, estimatedMinutes?: number, status?: string) {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify({ title, description, category, dueDate, estimatedMinutes, status }),
  })
}

export async function deleteTask(taskId: string) {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'DELETE',
  })
}

export async function getTrashTasks() {
  return apiRequest('/trash')
}

export async function restoreTask(taskId: string) {
  return apiRequest(`/tasks/${taskId}/restore`, {
    method: 'PUT',
  })
}

export async function permanentDeleteTask(taskId: string) {
  return apiRequest(`/trash/${taskId}`, {
    method: 'DELETE',
  })
}

// ===== 会话 API =====

export async function createSession(taskId: string | null, duration: number, startTime: string, endTime: string) {
  return apiRequest('/sessions', {
    method: 'POST',
    body: JSON.stringify({ taskId, duration, startTime, endTime }),
  })
}

export async function getSessions() {
  return apiRequest('/sessions')
}
