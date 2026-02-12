/**
 * СКРИПТ ДЛЯ ИМПОРТА МЕРОПРИЯТИЙ
 * 
 * Этот скрипт позволяет легко добавить реальные мероприятия в приложение.
 * 
 * ИНСТРУКЦИЯ:
 * 1. Откройте файл src/data/mockData.ts
 * 2. Найдите массив events
 * 3. Используйте функцию createEvent() ниже для создания новых мероприятий
 * 4. Скопируйте сгенерированный код в массив events
 * 
 * ФОРМАТ ДАННЫХ:
 * - id: уникальный идентификатор (например: 'event-1', 'event-2')
 * - title: название мероприятия
 * - description: описание мероприятия
 * - startTime: время начала в формате ISO (например: '2024-03-15T10:00:00')
 * - endTime: время окончания в формате ISO
 * - zoneId: ID зоны где проходит мероприятие (должен совпадать с ID из zones)
 * - speaker: имя спикера (опционально)
 * - capacity: вместимость зала (опционально)
 */

// ============================================
// ФУНКЦИЯ ДЛЯ СОЗДАНИЯ МЕРОПРИЯТИЯ
// ============================================

function createEvent({
  id,
  title,
  description,
  date,           // Дата в формате 'YYYY-MM-DD' (например: '2024-03-15')
  startTime,      // Время начала 'HH:MM' (например: '10:00')
  endTime,        // Время окончания 'HH:MM' (например: '11:30')
  zoneId,         // ID зоны (например: 'zone-1')
  speaker = '',
  capacity = 100
}) {
  const startDateTime = `${date}T${startTime}:00`
  const endDateTime = `${date}T${endTime}:00`
  
  return `  {
    id: '${id}',
    title: '${title}',
    description: '${description}',
    startTime: '${startDateTime}',
    endTime: '${endDateTime}',
    zoneId: '${zoneId}',
    speaker: '${speaker}',
    capacity: ${capacity}
  }`
}

// ============================================
// ПРИМЕР ИСПОЛЬЗОВАНИЯ
// ============================================

console.log('// Скопируйте этот код в src/data/mockData.ts в массив events:\n')

// Пример: создание нескольких мероприятий
const exampleEvents = [
  createEvent({
    id: 'event-1',
    title: 'Открытие форума',
    description: 'Торжественное открытие форума с приветственными речами',
    date: '2024-03-15',
    startTime: '09:00',
    endTime: '10:00',
    zoneId: 'zone-1',
    speaker: 'Иванов И.И.',
    capacity: 500
  }),
  
  createEvent({
    id: 'event-2',
    title: 'Мастер-класс по инновациям',
    description: 'Практический мастер-класс по внедрению инноваций',
    date: '2024-03-15',
    startTime: '10:30',
    endTime: '12:00',
    zoneId: 'zone-2',
    speaker: 'Петрова А.С.',
    capacity: 50
  }),
  
  createEvent({
    id: 'event-3',
    title: 'Обед',
    description: 'Обеденный перерыв',
    date: '2024-03-15',
    startTime: '12:00',
    endTime: '13:00',
    zoneId: 'zone-3',
    capacity: 200
  })
]

console.log(exampleEvents.join(',\n'))

// ============================================
// ШАБЛОН ДЛЯ БЫСТРОГО ЗАПОЛНЕНИЯ
// ============================================

console.log('\n\n// ============================================')
console.log('// ШАБЛОН ДЛЯ ВАШЕГО РАСПИСАНИЯ')
console.log('// ============================================\n')

const template = `
// Замените данные ниже на реальное расписание:

const myEvents = [
  createEvent({
    id: 'event-X',              // Уникальный ID
    title: 'Название',          // Название мероприятия
    description: 'Описание',    // Краткое описание
    date: '2024-03-15',         // Дата YYYY-MM-DD
    startTime: '10:00',         // Время начала HH:MM
    endTime: '11:00',           // Время окончания HH:MM
    zoneId: 'zone-1',           // ID зоны (см. список зон ниже)
    speaker: 'Имя спикера',     // Опционально
    capacity: 100               // Вместимость
  }),
  // Добавьте больше мероприятий...
]

// СПИСОК ДОСТУПНЫХ ЗОН (zoneId):
// - zone-1: Главный зал
// - zone-2: Конференц-зал А
// - zone-3: Конференц-зал Б
// - zone-4: Выставочная зона
// - zone-5: Зона регистрации
// - zone-6: Фуд-корт
// - zone-7: Лаунж-зона
`

console.log(template)

// ============================================
// ЭКСПОРТ ДЛЯ NODE.JS (если нужно)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createEvent }
}
