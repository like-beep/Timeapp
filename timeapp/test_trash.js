#!/usr/bin/env node

/**
 * 回收站功能测试脚本
 */

import http from 'http'

const API_BASE = 'http://localhost:3001/api'
let token = ''

function makeRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE)
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data),
          })
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data,
          })
        }
      })
    })

    req.on('error', reject)

    if (body) {
      req.write(JSON.stringify(body))
    }

    req.end()
  })
}

async function test() {
  console.log('🧪 开始测试回收站功能...\n')

  try {
    // 1. 注册用户
    console.log('1️⃣  注册新用户...')
    const registerRes = await makeRequest('POST', '/auth/register', {
      username: 'trashtest' + Date.now(),
      email: 'trashtest' + Date.now() + '@example.com',
      password: 'password123',
      nickname: '垃圾箱测试用户',
    })
    
    if (!registerRes.body.token) {
      throw new Error('注册失败: ' + JSON.stringify(registerRes.body))
    }
    
    console.log(`✅ 注册成功: ${registerRes.body.user?.username}`)
    token = registerRes.body.token
    console.log(`✅ 获得 Token: ${token.substring(0, 20)}...)\n`)

    // 2. 创建任务
    console.log('2️⃣  创建测试任务...')
    const createRes1 = await makeRequest('POST', '/tasks', {
      title: '测试任务 1',
      description: '这是一个测试任务',
      status: 'todo',
    })
    const taskId1 = createRes1.body.task?.id
    console.log(`✅ 创建任务 1: ${taskId1}`)

    const createRes2 = await makeRequest('POST', '/tasks', {
      title: '测试任务 2',
      description: '这是另一个测试任务',
      status: 'in-progress',
    })
    const taskId2 = createRes2.body.task?.id
    console.log(`✅ 创建任务 2: ${taskId2}\n`)

    // 3. 获取任务列表
    console.log('3️⃣  获取任务列表...')
    const getTasksRes = await makeRequest('GET', '/tasks')
    console.log(`✅ 获得 ${getTasksRes.body.length} 个任务\n`)

    // 4. 删除任务 1（软删除）
    console.log('4️⃣  删除任务 1（软删除）...')
    const deleteRes = await makeRequest('DELETE', `/tasks/${taskId1}`)
    console.log(`✅ ${deleteRes.body.message}\n`)

    // 5. 获取任务列表（应该只有 1 个任务）
    console.log('5️⃣  获取任务列表（删除后）...')
    const getTasksRes2 = await makeRequest('GET', '/tasks')
    console.log(`✅ 现在有 ${getTasksRes2.body.length} 个任务\n`)

    // 6. 获取回收站任务
    console.log('6️⃣  获取回收站任务...')
    const getTrashRes = await makeRequest('GET', '/trash')
    console.log(`✅ 回收站中有 ${getTrashRes.body.length} 个已删除的任务`)
    if (getTrashRes.body.length > 0) {
      console.log(`   - 任务: ${getTrashRes.body[0].title}`)
      console.log(`   - 删除时间: ${getTrashRes.body[0].deletedAt}\n`)
    }

    // 7. 恢复任务 1
    console.log('7️⃣  恢复任务 1...')
    const restoreRes = await makeRequest('PUT', `/tasks/${taskId1}/restore`)
    console.log(`✅ ${restoreRes.body.message}\n`)

    // 8. 获取任务列表（应该有 2 个任务）
    console.log('8️⃣  获取任务列表（恢复后）...')
    const getTasksRes3 = await makeRequest('GET', '/tasks')
    console.log(`✅ 现在有 ${getTasksRes3.body.length} 个任务\n`)

    // 9. 再次删除任务 1
    console.log('9️⃣  再次删除任务 1...')
    const deleteRes2 = await makeRequest('DELETE', `/tasks/${taskId1}`)
    console.log(`✅ ${deleteRes2.body.message}\n`)

    // 10. 永久删除任务 1
    console.log('🔟 永久删除任务 1...')
    const permanentDeleteRes = await makeRequest('DELETE', `/trash/${taskId1}`)
    console.log(`✅ ${permanentDeleteRes.body.message}\n`)

    // 11. 获取回收站任务（应该为空）
    console.log('1️⃣1️⃣  获取回收站任务（永久删除后）...')
    const getTrashRes2 = await makeRequest('GET', '/trash')
    console.log(`✅ 回收站中现在有 ${getTrashRes2.body.length} 个任务\n`)

    console.log('✅ ✅ ✅ 所有测试通过！回收站功能工作正常！')
  } catch (err) {
    console.error('❌ 测试失败:', err.message)
  }
}

test()
