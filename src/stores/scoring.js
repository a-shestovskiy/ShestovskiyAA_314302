// Математическое ядро скоринга (мок): взвешенная сумма нормированных факторов
export const FACTORS = [
  { key: 'load', name: 'Кредитная нагрузка', hint: 'Доля платежа в доходе' },
  { key: 'history', name: 'Кредитная история', hint: 'Данные Кредитного регистра' },
  { key: 'income', name: 'Стабильность дохода', hint: 'Стаж на текущем месте работы' },
  { key: 'age', name: 'Возраст заёмщика', hint: 'Оптимальный диапазон 30–55 лет' },
  { key: 'collateral', name: 'Обеспечение', hint: 'Залог или поручительство' }
]

export const THRESHOLD = 60

export function annuity(sum, ratePct, months) {
  const r = ratePct / 100 / 12
  if (!r) return sum / months
  return (sum * r) / (1 - Math.pow(1 + r, -months))
}

// Нормировка каждого фактора в диапазон 0..1
function normalise(p, loan) {
  const pay = annuity(loan.sum, loan.rate, loan.months)
  const loadRatio = pay / Math.max(p.income, 1)
  return {
    load: Math.max(0, Math.min(1, 1 - loadRatio / 0.6)),
    history: p.delays === 0 ? 1 : p.delays === 1 ? 0.55 : p.delays === 2 ? 0.25 : 0,
    income: Math.min(1, p.experience / 8),
    age: p.age < 21 ? 0.3 : p.age <= 30 ? 0.7 : p.age <= 55 ? 1 : p.age <= 65 ? 0.6 : 0.3,
    collateral:
      loan.collateral === 'Недвижимость' ? 1 : loan.collateral === 'Поручитель' ? 0.7 : loan.collateral === 'Транспорт' ? 0.6 : 0.2
  }
}

export function calcScore(profile, loan, weights) {
  if (profile.bankruptcy) {
    return { stop: 'Обнаружено банкротство заёмщика', score: 0, status: 'Отказ', factors: [] }
  }
  const norm = normalise(profile, loan)
  const factors = FACTORS.map((f) => {
    const w = weights[f.key]
    const points = +(norm[f.key] * w).toFixed(1)
    return { ...f, weight: w, norm: norm[f.key], points, positive: norm[f.key] >= 0.6 }
  })
  const score = Math.round(factors.reduce((s, f) => s + f.points, 0))
  return { stop: null, score, status: score >= THRESHOLD ? 'Одобрено' : 'Отказ', factors }
}
