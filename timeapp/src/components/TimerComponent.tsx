import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { createSession } from '../services/api'
import { notifyTimerFinished } from '../services/notificationService'

interface Props {
  initialSeconds?: number
  taskName?: string
  taskId?: string
  onTick?: (remaining: number) => void
  onFinish?: () => void
}

export default function TimerComponent({ initialSeconds = 1500, taskName, taskId, onTick, onFinish }: Props) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [saving, setSaving] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (running && !startTime) {
      setStartTime(new Date())
    }
  }, [running, startTime])

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setRemaining((r) => {
          const next = r - 1
          onTick?.(next)
          if (next <= 0) {
            setRunning(false)
            handleFinish()
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            return 0
          }
          return next
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [running])

  async function handleFinish() {
    if (startTime) {
      const endTime = new Date()
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
      
      try {
        setSaving(true)
        await createSession(taskId || null, duration, startTime.toISOString(), endTime.toISOString())
      } catch (err) {
        console.error('保存计时会话失败:', err)
      } finally {
        setSaving(false)
        setStartTime(null)
      }
    }
    notifyTimerFinished(taskName)
    onFinish?.()
  }

  function start() {
    setRunning(true)
  }
  function pause() {
    setRunning(false)
  }
  function reset() {
    setRunning(false)
    setRemaining(initialSeconds)
  }

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  return (
    <div>
      <div style={{ fontSize: 48 }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div>
        {!running ? <button onClick={start} disabled={saving}>开始</button> : <button onClick={pause} disabled={saving}>暂停</button>}
        <button onClick={reset} disabled={saving}>重置</button>
        {saving && <span style={{ marginLeft: '1em', color: '#666' }}>保存中...</span>}
      </div>
    </div>
  )
}
