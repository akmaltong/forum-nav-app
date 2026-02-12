# Анализ примеров Three-Geospatial Atmosphere

## Статус: ✅ Примеры скачаны и доступны

**Путь:** `three-geospatial-atmosphere-0.16.0/storybook/src/atmosphere/`

## Изученные примеры:

### 1. World Origin Rebasing (Рекомендуемый для нас!)
**Файл:** `Atmosphere-WorldOriginRebasing.tsx`
**URL:** https://takram-design-engineering.github.io/three-geospatial/?path=/story/atmosphere-atmosphere--world-origin-rebasing

#### Что делает:
- Размещает сцену в конкретной географической точке (долгота, широта, высота)
- Использует **light-source lighting** (SunLight + SkyLight)
- Модель "Littlest Tokyo" на земле с тенями
- Динамическое время суток с анимацией
- Lens flare эффект от солнца
- Автоматическое включение/выключение света модели (ночь/день)

#### Ключевые компоненты:

```tsx
<Atmosphere ref={setAtmosphere} correctAltitude={correctAltitude}>
  <Sky groundAlbedo='white' />
  <Stars data='atmosphere/stars.bin' />
  <SkyLight />
  <SunLight
    distance={5}
    castShadow
    shadow-normalBias={0.1}
    shadow-mapSize={[2048, 2048]}
  >
    <orthographicCamera
      attach='shadow-camera'
      top={4} bottom={-4} left={-4} right={4}
      near={0} far={600}
    />
  </SunLight>
  <EffectComposer multisampling={8}>
    <AerialPerspective />
    <LensFlare />
    <ToneMapping mode={toneMappingMode} />
    <Dithering />
  </EffectComposer>
</Atmosphere>
```

#### Настройка позиции:

```tsx
// Устанавливаем географическую позицию
geodetic.set(radians(longitude), radians(latitude), height)
Ellipsoid.WGS84.getNorthUpEastFrame(
  geodetic.toECEF(position),
  atmosphere.worldToECEFMatrix
)

// Обновляем время
useFrame(() => {
  if (atmosphere != null) {
    atmosphere.updateByDate(new Date(motionDate.get()))
  }
})
```

#### Материалы:
- **MeshLambertMaterial** для объектов (работает с light-source lighting)
- Plane с прозрачной текстурой для земли
- Модель масштабируется (scale={0.01})

---

### 2. Basic Example
**Файл:** `Atmosphere-Basic.tsx`

#### Что делает:
- Показывает оба режима освещения (post-process и light-source)
- Terrain из Cesium Ion
- TorusKnot как тестовый объект
- Переключение между режимами

#### Два режима освещения:

**Post-process lighting:**
```tsx
<MeshBasicMaterial color='white' />  // Unlit материал
<AerialPerspective sunLight={true} skyLight={true} />
```

**Light-source lighting:**
```tsx
<MeshLambertMaterial color='white' />  // Lit материал
<SunLight />
<SkyLight />
<AerialPerspective sunLight={false} skyLight={false} />
```

---

## Что нам подходит для внедрения:

### ✅ World Origin Rebasing - ИДЕАЛЬНО для нашего проекта!

**Почему:**
1. **Light-source lighting** - работает с нашими MeshStandardMaterial
2. **Простая настройка** - не требует изменения материалов
3. **Тени работают** - SunLight с castShadow
4. **Контроль времени** - можем установить полдень для яркости
5. **Lens flare** - красивый эффект от солнца
6. **Работает с обычными моделями** - не нужен terrain

### Что нужно адаптировать:

1. **Убрать географическую привязку** - использовать фиксированную позицию
2. **Упростить контролы** - убрать изменение локации
3. **Установить время на полдень** - для максимальной яркости
4. **Адаптировать под нашу модель** - вместо Littlest Tokyo
5. **Добавить HemisphereLight** - для дополнительного освещения интерьера

---

## Ключевые отличия от нашей попытки:

### ❌ Что мы делали неправильно:

1. **Неправильная позиция света:**
   ```tsx
   // Неправильно - мы использовали
   const position = new Vector3(0, 6371000, 0) // Радиус Земли
   
   // Правильно - в примере
   const position = geodetic.toECEF() // Конкретная точка на поверхности
   ```

2. **Неправильная настройка worldToECEFMatrix:**
   ```tsx
   // Неправильно - мы не настраивали
   
   // Правильно - в примере
   Ellipsoid.WGS84.getNorthUpEastFrame(position, atmosphere.worldToECEFMatrix)
   ```

3. **Отсутствие AerialPerspective:**
   ```tsx
   // Мы отключили его, думая что он затемняет
   // Но он нужен для атмосферных эффектов!
   <AerialPerspective />
   ```

4. **Неправильное использование intensity:**
   ```tsx
   // Неправильно - мы добавляли intensity вручную
   <SunLight intensity={2.5} />
   
   // Правильно - в примере нет intensity, он рассчитывается автоматически
   <SunLight />
   ```

---

## План внедрения:

### Шаг 1: Установить пакеты обратно
```bash
npm install @takram/three-atmosphere @takram/three-geospatial @takram/three-geospatial-effects --legacy-peer-deps
```

### Шаг 2: Создать компонент на основе WorldOriginRebasing

**Упрощенная версия для нашего проекта:**

```tsx
import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Atmosphere,
  Sky,
  SunLight,
  SkyLight,
  AerialPerspective,
  type AtmosphereApi
} from '@takram/three-atmosphere/r3f'
import { Ellipsoid, Geodetic, radians } from '@takram/three-geospatial'
import { ToneMapping } from '@react-three/postprocessing'
import { Dithering, LensFlare } from '@takram/three-geospatial-effects/r3f'
import { EffectComposer } from '@react-three/postprocessing'

export default function AtmosphericScene() {
  const atmosphereRef = useRef<AtmosphereApi>(null)
  
  // Фиксированная позиция (Токио для примера)
  const geodetic = useMemo(() => 
    new Geodetic(radians(139.7), radians(35.7), 500), 
    []
  )
  const position = useMemo(() => geodetic.toECEF(), [geodetic])
  
  // Настройка координатной системы
  useEffect(() => {
    if (atmosphereRef.current) {
      Ellipsoid.WGS84.getNorthUpEastFrame(
        position,
        atmosphereRef.current.worldToECEFMatrix
      )
    }
  }, [position])
  
  // Установить время на полдень
  const noonDate = useMemo(() => {
    const date = new Date()
    date.setHours(12, 0, 0, 0)
    return date
  }, [])
  
  // Обновление солнца
  useFrame(() => {
    if (atmosphereRef.current) {
      atmosphereRef.current.updateByDate(noonDate)
    }
  })
  
  return (
    <Atmosphere ref={atmosphereRef} correctAltitude={false}>
      <Sky />
      
      {/* Источники света */}
      <SkyLight />
      <SunLight 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-normalBias={0.1}
      />
      
      {/* Дополнительный свет для интерьера */}
      <hemisphereLight intensity={0.3} />
      
      {/* Эффекты */}
      <EffectComposer multisampling={8}>
        <AerialPerspective />
        <LensFlare />
        <ToneMapping mode="ACES_FILMIC" />
        <Dithering />
      </EffectComposer>
    </Atmosphere>
  )
}
```

### Шаг 3: Материалы
- Наши **MeshStandardMaterial** будут работать!
- Не нужно менять на MeshBasicMaterial
- Light-source lighting совместим с PBR материалами

### Шаг 4: Интеграция
- Заменить текущее освещение на AtmosphericScene
- Убрать HemisphereLight и DirectionalLight из Scene3D
- Оставить HDRI Environment для отражений (опционально)

---

## Преимущества этого подхода:

✅ **Работает с нашими материалами** - MeshStandardMaterial
✅ **Тени работают** - SunLight с castShadow
✅ **Яркое освещение** - полдень дает максимум света
✅ **Lens flare** - красивый эффект
✅ **Aerial perspective** - атмосферная дымка
✅ **Tone mapping** - правильная экспозиция
✅ **Простая настройка** - минимум кода

---

## Следующие шаги:

1. ✅ Изучили примеры - ГОТОВО
2. ⏭️ Установить пакеты обратно
3. ⏭️ Создать компонент AtmosphericScene
4. ⏭️ Интегрировать в Scene3D
5. ⏭️ Протестировать и настроить

**Готов начать внедрение?** 🚀
