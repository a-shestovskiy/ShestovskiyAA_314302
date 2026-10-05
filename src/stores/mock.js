// Мок внешних реестров (МВД, Кредитный регистр) и начальные данные
export const REGISTRY = {
  '190456789': { fio: 'Иванов Сергей Петрович', age: 41, income: 2850, experience: 9, delays: 0, bankruptcy: false, passport: 'MP 3456721' },
  '191234567': { fio: 'Козлова Анна Викторовна', age: 29, income: 1900, experience: 3, delays: 1, bankruptcy: false, passport: 'KH 1190342' },
  '192345678': { fio: 'Сидоров Дмитрий Олегович', age: 52, income: 1400, experience: 2, delays: 3, bankruptcy: true, passport: 'AB 7712045' }
}

export function lookupRegistry(unp) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (unp === '000000000') return reject(new Error('timeout'))
      if (REGISTRY[unp]) return resolve({ unp, ...REGISTRY[unp] })
      const n = [...unp].reduce((s, c) => s + c.charCodeAt(0), 0)
      resolve({
        unp,
        fio: 'Заёмщик №' + unp.slice(-4),
        age: 22 + (n % 38),
        income: 1200 + (n % 30) * 90,
        experience: n % 12,
        delays: n % 4 === 0 ? 2 : n % 3 === 0 ? 1 : 0,
        bankruptcy: false,
        passport: 'AB ' + (1000000 + n * 37)
      })
    }, 900)
  })
}

export const users0 = [
  { login: 'i.petrova', fio: 'Петрова Ирина Сергеевна', role: 'Кредитный инспектор', active: true, last: '05.10.2026 09:12' },
  { login: 'a.volkov', fio: 'Волков Артём Игоревич', role: 'Кредитный инспектор', active: true, last: '05.10.2026 08:47' },
  { login: 'o.smirnova', fio: 'Смирнова Ольга Андреевна', role: 'Кредитный инспектор', active: false, last: '28.09.2026 17:30' },
  { login: 'admin', fio: 'Козлов Максим Юрьевич', role: 'Системный администратор', active: true, last: '05.10.2026 08:15' }
]

export const apps0 = [
  { id: 'ЗК-2026-0412', date: '05.10.2026', fio: 'Иванов Сергей Петрович', unp: '190456789', sum: 25000, months: 36, score: 82, status: 'Одобрено' },
  { id: 'ЗК-2026-0411', date: '04.10.2026', fio: 'Козлова Анна Викторовна', unp: '191234567', sum: 12000, months: 24, score: 58, status: 'Отказ' },
  { id: 'ЗК-2026-0410', date: '04.10.2026', fio: 'Лебедев Игорь Николаевич', unp: '193456780', sum: 8000, months: 12, score: 71, status: 'Ожидает подписания' },
  { id: 'ЗК-2026-0409', date: '03.10.2026', fio: 'Сидоров Дмитрий Олегович', unp: '192345678', sum: 15000, months: 48, score: 0, status: 'Отказ' },
  { id: 'ЗК-2026-0408', date: '02.10.2026', fio: 'Новикова Елена Павловна', unp: '194567801', sum: 30000, months: 60, score: 76, status: 'Одобрено' },
  { id: 'ЗК-2026-0407', date: '02.10.2026', fio: 'Мартынов Олег Васильевич', unp: '195678012', sum: 5000, months: 12, score: 64, status: 'Одобрено' },
  { id: 'ЗК-2026-0406', date: '01.10.2026', fio: 'Захарова Мария Ильинична', unp: '196780123', sum: 18000, months: 36, score: 49, status: 'Отказ' }
]

export const audit0 = [
  { time: '05.10.2026 09:13:07', user: 'i.petrova', type: 'Расчёт', msg: 'Заявка ЗК-2026-0412: рейтинг 82, статус «Одобрено»', level: 'info' },
  { time: '05.10.2026 09:13:05', user: 'i.petrova', type: 'Запрос реестра', msg: 'Кредитный регистр: ответ получен за 1,1 с', level: 'info' },
  { time: '05.10.2026 09:12:41', user: 'i.petrova', type: 'Вход', msg: 'Успешная авторизация', level: 'info' },
  { time: '05.10.2026 08:58:20', user: 'system', type: 'Интеграция', msg: 'База МВД: превышено время ожидания, повторная попытка 2 из 3', level: 'warn' },
  { time: '05.10.2026 08:47:33', user: 'a.volkov', type: 'Ошибка авторизации', msg: 'Неверный пароль (попытка 2 из 5)', level: 'error' },
  { time: '05.10.2026 08:15:02', user: 'admin', type: 'Калибровка', msg: 'Вес «Кредитная нагрузка» изменён с 25 на 30', level: 'info' },
  { time: '04.10.2026 18:40:11', user: 'admin', type: 'Учётные записи', msg: 'Профиль o.smirnova заблокирован', level: 'warn' },
  { time: '04.10.2026 12:05:49', user: 'system', type: 'Резервное копирование', msg: 'Ежесуточная копия БД создана', level: 'info' }
]
