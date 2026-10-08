# Access — демо-кабинет

React + TypeScript + Vite, React Router (Declarative), Axios, TanStack Query, Tailwind CSS 4 и базовые компоненты по модели shadcn/ui. Правила архитектуры — в AGENTS.md.

## Запуск

Node.js 22.12+ или 24. После первого `npm install` использовать `npm ci` с созданным lockfile.

```sh
npm ci
npm run dev
npm run build
npm test
npx playwright install chromium
npm run test:e2e
# В облачном окружении можно использовать установленный браузер:
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e
```

Демо: `admin@example.com` / `Demo12345!`. После входа открывается `/admin/dashboard`. Все ответы проходят через фейковый Axios-адаптер в `src/api/fake`.

Сессия хранится в localStorage один час; пароль и одноразовые токены — только в памяти текущей вкладки. Перезагрузка восстанавливает исходный демо-пароль и аннулирует ссылки сброса. Для сброса открыть демо-ссылку в той же вкладке, без перезагрузки. Реальные письма не отправляются. Это демонстрация, не система защиты реальных данных.

Дизайн настраивается в `src/styles/tokens.css` (шкалы) и `themes.css` (семантические цвета и темы). `components.json` направляет shadcn CLI в `src/shared/ui`. Общий транспорт — в `src/api`, операции авторизации — в `src/features/auth`.

На production-хостинге все пути, не соответствующие статическим файлам, должны возвращать `index.html` (SPA fallback). Vite поддерживает это при локальной разработке и preview.

WCAG 2.2 AA — цель: есть семантические формы, клавиатурная навигация, skip-link, состояния загрузки и ошибок, обе темы, reduced motion. Автотесты не подтверждают полное соответствие; ручная проверка скринридером необходима.
