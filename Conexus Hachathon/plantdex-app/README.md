# 🌿 PlantDex — мобильное приложение (React Native / Expo)

Настоящее приложение: камера → Pl@ntNet определяет растение → описание из Wikipedia →
собираешь виды в коллекцию-декс. Звонит в Pl@ntNet **напрямую**, бэкенд не нужен.

---

## Что нужно один раз поставить

1. **Node.js** (у тебя уже есть).
2. **Expo Go** на телефон — из Play Market (Android) или App Store (iPhone). Это
   приложение, через которое запускается наш проект без сборки APK.

---

## Запуск

В терминале (cmd):

```cmd
cd /d "C:\Users\storo\Claude\Projects\Conexus Hachathon\plantdex-native"
npm install
npx expo start --tunnel
```

Появится **QR-код** в терминале.

- **Android:** открой Expo Go → «Scan QR code» → наведи на QR.
- **iPhone:** открой обычную Камеру → наведи на QR → нажми всплывающую ссылку (откроется в Expo Go).

Приложение загрузится прямо на телефон. Меняешь код — оно обновляется на лету.

> Почему `--tunnel`: он соединяет телефон с компьютером **через интернет**, а не по
> локальной сети. Это обходит блокировку университетского Wi-Fi (`wifi.aua.gr`), из-за
> которой не открывалась веб-версия. Телефон может быть даже на мобильном интернете.
> При первом запуске Expo сам доустановит нужный пакет для туннеля — согласись (y).

---

## Если Expo Go ругается на версию SDK

Expo Go в магазине всегда самой свежей версии и поддерживает только последние SDK.
Если увидишь сообщение вида «Project is incompatible / requires SDK XX», собери чистый
проект текущей версии и перенеси в него наши файлы:

```cmd
npx create-expo-app@latest plantdex-fresh
cd plantdex-fresh
npx expo install expo-image-picker @react-native-async-storage/async-storage
npm install zustand
```

Затем скопируй из `plantdex-native` в `plantdex-fresh`:
- файл `App.js` (заменить),
- папку `src/` целиком,
- блок `plugins` и `permissions` из `app.json`.

И снова `npx expo start --tunnel`.

---

## Структура

```
plantdex-native/
├── App.js                      шапка (очки, прогресс), вкладки, нижняя навигация
├── app.json                    имя, иконка, разрешения камеры
├── index.js
├── src/
│   ├── theme.js                цвета
│   ├── services/
│   │   ├── config.js           🔑 ключ Pl@ntNet
│   │   └── plantnet.js         вызов Pl@ntNet + Wikipedia + оффлайн-фолбэк
│   ├── store/
│   │   └── useCollection.js    zustand + AsyncStorage (декс, очки)
│   ├── data/
│   │   └── samplePlants.js     запасные данные, если нет сети
│   └── screens/
│       ├── ScanScreen.js       камера/галерея + анимация
│       ├── ResultCard.js       карточка вида + «в коллекцию»
│       └── CollectionScreen.js декс с прогрессом
```

## Как это работает

- **Камера:** `expo-image-picker` — нативная камера или галерея.
- **Распознавание:** фото уходит прямо в Pl@ntNet (`src/services/plantnet.js`),
  ключ лежит в `src/services/config.js` (500 сканов/день бесплатно).
- **Описание + фото:** подтягиваются из Wikipedia по названию вида.
- **Игра:** каждый новый вид = +100 очков, прогресс декса до 24 видов, всё хранится
  на телефоне через AsyncStorage.
- **Нет сети / сбой:** показывается пример из `samplePlants.js`, приложение не виснет.

## ⚠ Про ключ

Ключ Pl@ntNet зашит в приложение. Для хакатона это нормально, но в публичном релизе
его смогут извлечь — тогда вынеси вызов на сервер (готовый Python-бэкенд лежит в
`../plantdex/backend`) и пусть приложение обращается к нему.
