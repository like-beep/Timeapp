import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate, getMonthDates } from '../utils/dateUtils'

interface Props {
  onSelectDate?: (date: string) => void
  navigateToTasks?: boolean
}

export default function CalendarView({ onSelectDate, navigateToTasks }: Props) {
  const navigate = useNavigate()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const dayNames = ['日', '一', '二', '三', '四', '五', '六']

  const dates = getMonthDates(year, month)

  function prevMonth() {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  function isToday(d: number) {
    return year === today.getFullYear() && month === today.getMonth() && d === today.getDate()
  }

  function handleDateClick(d: number) {
    const dateStr = formatDate(new Date(year, month, d))
    onSelectDate?.(dateStr)
    if (navigateToTasks) {
      navigate('/tasks', { state: { selectedDate: dateStr } })
    }
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '1em', borderRadius: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
        <button onClick={prevMonth}>←</button>
        <span>{year}年 {monthNames[month]}</span>
        <button onClick={nextMonth}>→</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {dayNames.map(d => <div key={d} style={{ textAlign: 'center', fontWeight: 'bold' }}>{d}</div>)}
        {dates.map((d, i) => (
          <div
            key={i}
            style={{
              padding: '0.5em',
              textAlign: 'center',
              backgroundColor: isToday(d) ? '#4CAF50' : '#f0f0f0',
              color: isToday(d) ? 'white' : 'black',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
            onClick={() => handleDateClick(d)}
          >
            {d || ''}
          </div>
        ))}
      </div>
    </div>
  )
}
