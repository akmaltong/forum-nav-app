# Полноэкранный режим и адаптивность Canvas

## Реализованные функции

### 1. Адаптивный размер Canvas
Canvas автоматически подстраивается под размер окна браузера:
- Использует `100vw` и `100vh` для полного покрытия экрана
- Динамический `100dvh` для мобильных браузеров (учитывает панели)
- Автоматическое обновление при изменении размера окна

### 2. Обработка события Resize
```javascript
window.addEventListener('resize', handleResize)
```
При изменении размера окна:
- Обновляется размер canvas
- Пересчитывается aspect ratio камеры
- Вызывается `camera.updateProjectionMatrix()`

### 3. Ограничение Pixel Ratio
```javascript
dpr={[1, 2]} // Минимум 1x, максимум 2x
```
Преимущества:
- Оптимальная производительность на устройствах с высоким DPI
- Предотвращает избыточную нагрузку на GPU
- Баланс между качеством и FPS

### 4. Полноэкранный режим (NEW!)
**Двойной клик по canvas** переключает полноэкранный режим:
- Вход в fullscreen: двойной клик
- Выход: двойной клик или ESC

#### Как это работает:
```javascript
canvas.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})
```

#### Обработка изменений:
```javascript
document.addEventListener('fullscreenchange', () => {
  // Обновление размеров canvas
  // Пересчет камеры
})
```

## Оптимизации производительности

### Canvas настройки:
```javascript
gl={{
  alpha: false,              // Отключить прозрачность
  preserveDrawingBuffer: false, // Не сохранять буфер
  powerPreference: 'high-performance',
  antialias: true
}}
```

### Pixel Ratio:
```javascript
const pixelRatio = Math.min(window.devicePixelRatio, 2)
state.gl.setPixelRatio(pixelRatio)
```

### Touch Action:
```css
touchAction: 'none' // Предотвращает жесты браузера
```

## Использование

### Полноэкранный режим:
1. Откройте приложение
2. Дважды кликните по 3D сцене
3. Приложение развернется на весь экран
4. Для выхода: дважды кликните снова или нажмите ESC

### Адаптивность:
- Измените размер окна браузера
- Canvas автоматически подстроится
- Камера пересчитает пропорции
- FPS останется стабильным

## Технические детали

### Поддержка браузеров:
- Chrome/Edge: ✅ Полная поддержка
- Firefox: ✅ Полная поддержка
- Safari: ✅ Полная поддержка (с префиксом webkit)
- Mobile: ✅ Работает на iOS и Android

### Fallback для старых браузеров:
```javascript
canvas.requestFullscreen().catch(err => {
  console.log(`Fullscreen not supported: ${err.message}`)
})
```

## Проблемы и решения

### Проблема: Canvas не обновляется при fullscreen
**Решение:** Добавлен обработчик `fullscreenchange` с задержкой:
```javascript
setTimeout(() => {
  canvas.style.width = '100%'
  canvas.style.height = '100%'
}, 100)
```

### Проблема: Низкий FPS на мобильных
**Решение:** Ограничение pixel ratio до 2x:
```javascript
dpr={[1, 2]}
```

### Проблема: Жесты браузера мешают управлению
**Решение:** Отключение touch action:
```css
touchAction: 'none'
```

## Дополнительные улучшения

### Будущие возможности:
- [ ] Кнопка для входа в fullscreen (не только двойной клик)
- [ ] Индикатор полноэкранного режима
- [ ] Настройка качества в зависимости от FPS
- [ ] Автоматическое снижение качества при низком FPS

## Ссылки
- [MDN: Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
- [Three.js: Responsive Design](https://threejs.org/manual/#en/responsive)
- [React Three Fiber: Performance](https://docs.pmnd.rs/react-three-fiber/advanced/performance)
