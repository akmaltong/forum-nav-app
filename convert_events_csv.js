#!/usr/bin/env node

/**
 * КОНВЕРТЕР CSV В TYPESCRIPT
 * 
 * Конвертирует CSV файл с мероприятиями в TypeScript код
 * для вставки в src/data/mockData.ts
 * 
 * ИСПОЛЬЗОВАНИЕ:
 *   node convert_events_csv.js events.csv
 * 
 * ФОРМАТ CSV:
 *   id,title,description,date,startTime,endTime,zoneId,speaker,capacity
 */

const fs = require('fs')
const path = require('path')

// Проверка аргументов
if (process.argv.length < 3) {
  console.error('❌ Ошибка: не указан файл CSV')
  console.log('\nИспользование:')
  console.log('  node convert_events_csv.js events.csv')
  console.log('\nПример CSV файла:')
  console.log('  id,title,description,date,startTime,endTime,zoneId,speaker,capacity')
  console.log('  event-1,Открытие,Описание,2024-03-15,09:00,10:00,zone-1,Иванов И.И.,500')
  process.exit(1)
}

const csvFile = process.argv[2]

// Проверка существования файла
if (!fs.existsSync(csvFile)) {
  console.error(`❌ Ошибка: файл "${csvFile}" не найден`)
  process.exit(1)
}

// Чтение CSV файла
const csvContent = fs.readFileSync(csvFile, 'utf-8')
const lines = csvContent.trim().split('\n')

if (lines.length < 2) {
  console.error('❌ Ошибка: CSV файл пустой или содержит только заголовок')
  process.exit(1)
}

// Парсинг CSV
function parseCSVLine(line) {
  const values = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  values.push(current.trim())
  return values
}

// Парсинг заголовка
const headers = parseCSVLine(lines[0])
console.log('📋 Найдены колонки:', headers.join(', '))

// Парсинг данных
const events = []
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim()
  if (!line) continue
  
  const values = parseCSVLine(line)
  const event = {}
  
  headers.forEach((header, index) => {
    event[header] = values[index] || ''
  })
  
  events.push(event)
}

console.log(`✅ Обработано мероприятий: ${events.length}\n`)

// Генерация TypeScript кода
console.log('// ============================================')
console.log('// СКОПИРУЙТЕ КОД НИЖЕ В src/data/mockData.ts')
console.log('// В массив events')
console.log('// ============================================\n')

const tsCode = events.map(event => {
  const {
    id,
    title,
    description,
    date,
    startTime,
    endTime,
    zoneId,
    speaker = '',
    capacity = '100'
  } = event
  
  // Валидация обязательных полей
  if (!id || !title || !date || !startTime || !endTime || !zoneId) {
    console.error(`⚠️  Предупреждение: пропущены обязательные поля в строке:`, event)
    return null
  }
  
  const startDateTime = `${date}T${startTime}:00`
  const endDateTime = `${date}T${endTime}:00`
  
  return `  {
    id: '${id}',
    title: '${title}',
    description: '${description || ''}',
    startTime: '${startDateTime}',
    endTime: '${endDateTime}',
    zoneId: '${zoneId}',
    speaker: '${speaker}',
    capacity: ${capacity}
  }`
}).filter(Boolean)

console.log(tsCode.join(',\n'))

console.log('\n\n// ============================================')
console.log('// ИНСТРУКЦИЯ:')
console.log('// 1. Откройте файл src/data/mockData.ts')
console.log('// 2. Найдите: export const events: Event[] = [')
console.log('// 3. Замените содержимое массива на код выше')
console.log('// 4. Сохраните файл')
console.log('// 5. Приложение автоматически перезагрузится')
console.log('// ============================================')

// Сохранение в файл (опционально)
const outputFile = csvFile.replace('.csv', '_converted.ts')
const fullOutput = `// Сгенерировано из ${csvFile}\n// ${new Date().toLocaleString('ru-RU')}\n\nexport const events = [\n${tsCode.join(',\n')}\n]\n`

fs.writeFileSync(outputFile, fullOutput, 'utf-8')
console.log(`\n💾 Результат также сохранен в файл: ${outputFile}`)
