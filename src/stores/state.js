import { reactive } from 'vue'
import { apps0, audit0, users0 } from './mock'

export const state = reactive({
  user: null, // { login, fio, role }
  weights: { load: 30, history: 25, income: 20, age: 10, collateral: 15 },
  applications: [...apps0],
  users: users0.map((u) => ({ ...u })),
  audit: [...audit0],
  draft: null // { profile, loan, result }
})

export const ADMIN = 'Системный администратор'
export const INSPECTOR = 'Кредитный инспектор'

export function logEvent(type, msg, level = 'info') {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  state.audit.unshift({
    time: `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`,
    user: state.user?.login ?? 'system',
    type,
    msg,
    level
  })
}
