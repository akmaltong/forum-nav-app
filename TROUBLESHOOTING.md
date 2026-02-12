# Устранение проблем

## Ошибка 504 "Outdated Optimize Dep"

### Проблема:
```
Failed to load resource: the server responded with a status of 504 (Outdated Optimize Dep)
```

### Причина:
Vite кеширует зависимости для оптимизации. После обновления пакетов (особенно Three.js с 0.160 до 0.170) кеш устаревает.

### Решение:

**Вариант 1 - Быстрый (PowerShell):**
```powershell
# Остановите сервер (Ctrl+C)
# Очистите кеш Vite
Remove-Item -Recurse -Force node_modules\.vite

# Запустите сервер заново
npm run dev
```

**Вариант 2 - Полный (если вариант 1 не помог):**
```powershell
# Остановите сервер (Ctrl+C)
# Удалите node_modules и package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Переустановите зависимости
npm install --legacy-peer-deps

# Запустите сервер
npm run dev
```

**Вариант 3 - Через npm:**
```bash
npm run dev -- --force
```

## Ошибка с model-viewer-4.1.0

### Проблема:
```
Error: The following dependencies are imported but could not be resolved:
  examples/built/dependencies.js (imported by model-viewer-4.1.0/...)
```

### Причина:
Папка model-viewer-4.1.0 находится в проекте, но не является частью нашего приложения.

### Решение:
Уже исправлено в `vite.config.ts`:
```typescript
server: {
  fs: {
    deny: ['**/model-viewer-4.1.0/**']
  }
}
```

Если ошибка повторяется:
1. Удалите папку `model-viewer-4.1.0` (если она не нужна)
2. Или переместите её за пределы проекта

## Атмосферное освещение не работает

### Проблема:
Переключение на режим "Атмосфера" не показывает изменений или выдает ошибки.

### Проверьте:

**1. Версия Three.js:**
```bash
npm list three
```
Должно быть >= 0.170.0

**2. Установлены ли пакеты:**
```bash
npm list @takram/three-atmosphere
npm list @takram/three-geospatial
```

**3. Консоль браузера:**
- Откройте DevTools (F12)
- Проверьте вкладку Console на ошибки
- Проверьте вкладку Network на 404 ошибки

### Решение:

**Если пакеты не установлены:**
```bash
npm install @takram/three-atmosphere @takram/three-geospatial --legacy-peer-deps
```

**Если версия Three.js старая:**
```bash
npm install three@^0.170.0 --legacy-peer-deps
```

**Если есть конфликты зависимостей:**
```bash
npm install --legacy-peer-deps --force
```

## Черный экран / Ничего не отображается

### Проблема:
После переключения на атмосферный режим экран черный.

### Причины и решения:

**1. Камера в неправильной позиции:**
- Переключитесь в режим "Угловой вид"
- Попробуйте покрутить колесико мыши (zoom)

**2. Модель не загрузилась:**
- Проверьте консоль на ошибки загрузки
- Убедитесь что файл `SM_MFF.glb` существует в `/public/`

**3. Слишком темное освещение:**
- Переключитесь обратно на HDRI режим
- Настройте яркость
- Попробуйте другое окружение

## Низкая производительность (FPS)

### Проблема:
Приложение тормозит, особенно в атмосферном режиме.

### Решения:

**1. Переключитесь на HDRI режим:**
- Откройте панель ОСВЕЩЕНИЕ
- Выберите режим HDRI

**2. Отключите SSAO:**
- В панели ОСВЕЩЕНИЕ
- Снимите галочку SSAO

**3. Уменьшите качество теней:**
В `Scene3D.tsx` измените:
```typescript
shadow-mapSize-width={2048}  // было 4096
shadow-mapSize-height={2048}  // было 4096
```

**4. Отключите multisampling:**
В `Effects.tsx` или `AtmosphericEffects.tsx`:
```typescript
<R3FEffectComposer multisampling={0}>  // было 8
```

## Content Security Policy (CSP) ошибки

### Проблема:
```
Executing inline script violates the following Content Security Policy directive
```

### Причина:
Расширения браузера (например, расширения для вкладок) могут вызывать эти предупреждения.

### Решение:
- Это не критично для работы приложения
- Можно игнорировать
- Или отключите расширения браузера для localhost

## Ошибки импорта TypeScript

### Проблема:
```
Cannot find module '@takram/three-atmosphere/r3f'
```

### Решение:

**1. Переустановите типы:**
```bash
npm install @types/three@latest --save-dev
```

**2. Очистите кеш TypeScript:**
```bash
# В VS Code: Ctrl+Shift+P
# Выберите: TypeScript: Restart TS Server
```

**3. Проверьте tsconfig.json:**
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["vite/client"]
  }
}
```

## Горячая перезагрузка (HMR) не работает

### Проблема:
Изменения в коде не применяются автоматически.

### Решение:

**1. Перезапустите сервер:**
```bash
# Ctrl+C для остановки
npm run dev
```

**2. Очистите кеш браузера:**
- Ctrl+Shift+R (жесткая перезагрузка)
- Или откройте в режиме инкогнито

**3. Проверьте vite.config.ts:**
```typescript
server: {
  hmr: true  // Должно быть включено
}
```

## Восстановление из бэкапа

### Если что-то пошло не так:

**1. Найдите бэкап:**
```
../forum-nav-app5_backup_v1_20260212_021158/
```

**2. Восстановите файлы:**
```powershell
# Удалите текущие файлы (кроме node_modules)
Remove-Item -Recurse -Force src, public, *.ts, *.json -Exclude node_modules

# Скопируйте из бэкапа
Copy-Item -Recurse ..\forum-nav-app5_backup_v1_*\* .
```

**3. Переустановите зависимости:**
```bash
npm install
npm run dev
```

## Получение помощи

### Логи для отладки:

**1. Консоль браузера (F12):**
- Вкладка Console - ошибки JavaScript
- Вкладка Network - проблемы загрузки
- Вкладка Performance - проблемы производительности

**2. Терминал:**
- Ошибки компиляции
- Ошибки сервера
- Предупреждения зависимостей

**3. Файлы для проверки:**
- `package.json` - версии пакетов
- `vite.config.ts` - конфигурация сборки
- `src/components/Scene3D.tsx` - основная сцена
- `src/store/appStore.ts` - состояние приложения

### Полезные команды:

```bash
# Проверить версии пакетов
npm list

# Проверить устаревшие пакеты
npm outdated

# Проверить конфликты
npm ls

# Аудит безопасности
npm audit

# Очистить все кеши
npm cache clean --force
```
