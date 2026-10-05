// Токены дизайн-системы: цвета (раздел 1 отчёта)
export const theme = {
  dark: false,
  colors: {
    background: '#F4F6FA',
    surface: '#FFFFFF',
    primary: '#1F4E9C',
    'primary-darken-1': '#143A75',
    secondary: '#0E9F8E',
    success: '#2E7D32',
    warning: '#E08600',
    error: '#C62828',
    info: '#1976D2',
    'on-background': '#1B2433',
    'on-surface': '#1B2433'
  }
}

export const palette = [
  { name: 'Основной', token: 'primary', hex: '#1F4E9C', use: 'Кнопки, ссылки, активный пункт меню' },
  { name: 'Основной тёмный', token: 'primary-dark', hex: '#143A75', use: 'Боковое меню, заголовки' },
  { name: 'Акцент', token: 'secondary', hex: '#0E9F8E', use: 'Вторичные действия, позитивные факторы' },
  { name: 'Успех', token: 'success', hex: '#2E7D32', use: 'Статус «Одобрено»' },
  { name: 'Предупреждение', token: 'warning', hex: '#E08600', use: 'Статус «На рассмотрении»' },
  { name: 'Ошибка', token: 'error', hex: '#C62828', use: 'Статус «Отказ», ошибки ввода' },
  { name: 'Фон', token: 'background', hex: '#F4F6FA', use: 'Фон страницы' },
  { name: 'Поверхность', token: 'surface', hex: '#FFFFFF', use: 'Карточки, таблицы, формы' },
  { name: 'Текст', token: 'text', hex: '#1B2433', use: 'Основной текст' },
  { name: 'Вторичный текст', token: 'muted', hex: '#667085', use: 'Подписи, подсказки' },
  { name: 'Граница', token: 'border', hex: '#D8DEE9', use: 'Рамки полей и карточек' }
]
