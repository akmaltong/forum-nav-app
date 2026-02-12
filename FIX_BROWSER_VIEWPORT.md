# Исправление проблемы с отображением в браузерах

## Проблема
Нижнее меню обрезалось в обычных браузерах (Chrome, Яндекс), но работало в Telegram WebView.

## Что было исправлено

### 1. Нижнее меню (BottomNav)
- Добавлена поддержка `safe-area-inset-bottom` для корректного отступа от нижней панели браузера
- Используется `max()` для гарантии минимального отступа даже без safe area

### 2. 3D Canvas (Scene3D)
- Добавлен обработчик `resize` для пересчета размеров при изменении окна
- Улучшена инициализация размеров canvas и camera aspect ratio
- Добавлены inline стили для гарантии 100% размера

### 3. Глобальные стили (index.css)
- Добавлен `100dvh` (dynamic viewport height) для мобильных браузеров
- Фиксированное позиционирование body для предотвращения скролла
- Улучшена структура html/body/root для полноэкранного режима

## Тестирование

1. Откройте приложение в Chrome/Яндекс браузере
2. Проверьте, что нижнее меню полностью видно
3. Измените размер окна браузера - 3D сцена должна адаптироваться
4. Проверьте на мобильном устройстве - меню не должно перекрываться панелью браузера

## Технические детали

### CSS Safe Area
```css
padding-bottom: max(20px, calc(env(safe-area-inset-bottom) + 12px))
```
Обеспечивает минимум 20px отступа, но добавляет больше если есть safe area (вырез, панель навигации).

### Three.js Resize Handler
```javascript
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})
```
React Three Fiber делает это автоматически, но мы добавили дополнительную проверку.

### Dynamic Viewport Height
```css
height: 100dvh; /* Вместо 100vh */
```
`100dvh` учитывает панели браузера на мобильных устройствах, в отличие от `100vh`.
