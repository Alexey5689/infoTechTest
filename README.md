# Каталог книг - Vue 3 приложение

Полнофункциональное веб-приложение для управления каталогом книг и авторов, построенное на Vue 3 с Pinia и Tailwind CSS.

## Функционал

### Для всех пользователей:

- **Каталог книг** - просмотр, поиск, фильтрация по году
- **Список авторов** - просмотр всех авторов и их книг
- **Отчёты** - ТОП-10 авторов по количеству выпущенных книг за год
- **Подписка на авторов** - гости могут подписаться на уведомления

### Для авторизованных пользователей:

- **Добавление книг** - создание новых книг с авторами
- **Редактирование** - изменение информации о книгах и авторах
- **Удаление** - удаление книг и авторов
- **Управление авторами** - полный CRUD для авторов

## 🛠 Технический стек

- **Vue 3** - фреймворк
- **Vite** - сборщик проекта
- **Pinia** - управление состоянием
- **Vue Router** - маршрутизация
- **Tailwind CSS** - стилизация
- **Axios** - HTTP клиент (для интеграции с API)

## Установка

### Требования:

- Node.js (v16+)
- npm или yarn или bun

### Шаги установки:

```bash
# Клонируйте или загрузите проект
cd InfoTechTest

# Установите зависимости
bun install

# Запустите dev сервер
bun run dev

# Откроется браузер на http://localhost:5173
```

## Использование

### Вход в приложение:

1. **Как пользователь:**
    - Username: `admin` (любое значение)
    - Password: любое значение
    - Получите доступ к полному функционалу

2. **Как гость:**
    - Кликните "Продолжить как гость"
    - Сможете просматривать, но не редактировать

### Основные страницы:

- `/catalog` - Каталог книг
- `/authors` - Управление авторами
- `/reports` - Отчёты (ТОП-10 авторов)
- `/books-manage` - Управление книгами (только для авторизованных)
- `/login` - Страница входа

## Структура проекта

```
books-app/
├── src/
│   ├── components/        # Переиспользуемые компоненты
│   │   ├── BookCard.vue
│   │   ├── AuthorCard.vue
│   │   └── SubscribeModal.vue
│   ├── pages/             # Страницы приложения
│   │   ├── LoginPage.vue
│   │   ├── CatalogPage.vue
│   │   ├── AuthorsPage.vue
│   │   ├── ReportsPage.vue
│   │   └── BooksManagePage.vue
│   ├── stores/            # Pinia stores: состояние и оркестрация (без данных и логики «сервера»)
│   │   ├── authStore.js
│   │   ├── booksStore.js
│   │   ├── authorsStore.js
│   │   ├── subscriptionsStore.js
│   │   └── reportsStore.js
│   ├── api/               # Слой доступа к данным по контракту book.yaml (сейчас поверх мок-базы)
│   │   ├── booksApi.js, authorsApi.js, reportsApi.js, authApi.js, subscriptionsApi.js
│   │   └── errors.js, paginate.js, serializers.js
│   ├── services/          # SMS Pilot (эмуляция) и рассылка уведомлений подписчикам
│   ├── mocks/             # Сиды и мок-«БД» в памяти (удаляется при подключении реального API)
│   ├── router/
│   │   └── index.js       # Vue Router конфиг
│   ├── App.vue            # Главный компонент
│   ├── main.js            # Точка входа
│   └── style.css          # Глобальные стили
├── index.html             # HTML точка входа
├── vite.config.js         # Vite конфиг
├── tailwind.config.js     # Tailwind конфиг
├── postcss.config.js      # PostCSS конфиг
├── package.json           # Зависимости
└── README.md              # Этот файл
```

## 🔧 Скрипты

```bash
# Разработка (с hot reload)
bun run dev

# Собрать для продакшена
bun run build

# Просмотр собранного проекта
bun run preview

# Lint и автофиксинг кода
bun run lint
```

## Интеграция с реальным API

Когда понадобится подключить реальный бэк:

1. **Обновите `src/api`** - замените тела функций на реальные axios вызовы (stores и страницы менять не нужно), удалите `src/mocks`
2. **Добавьте обработку ошибок** - для сетевых ошибок
3. **Обновите токен** - используйте реальные JWT токены от бэка

Пример для `authStore.js`:

```javascript
const login = async (username, password) => {
    try {
        const response = await axios.post('/api/v1/auth/login', {
            username,
            password,
        });
        const { token, user } = response.data.data;
        token.value = token;
        user.value = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.errors?.[0]?.message || 'Ошибка входа',
        };
    }
};
```

## Функции подписки и SMS

Текущая реализация использует **mock-сервер** для демонстрации.

Для интеграции с **SMS Pilot**:

- Добавьте API вызов на бэке при создании подписки
- Используйте тестовый ключ `emulator` для разработки
- На фронте просто вызовите `POST /api/v1/subscriptions`

## Авторизация

Приложение использует **Bearer Token** (JWT) для авторизации.

Все защищённые маршруты:

- Требуют валидный токен в `Authorization: Bearer <token>`
- Автоматически редиректят на страницу входа если токен истёк

## Mock Data

Приложение поставляется с примерными данными:

- 4 книги
- 3 автора

Книги и авторы хранятся в памяти (`src/mocks/db.js`) и сбрасываются при перезагрузке страницы. В **localStorage** сохраняются только сессия (токен) и подписки.

## 🐛 Возможные проблемы и решения

### Порт 5173 занят?

```bash
bun run dev -- --port 3000
```

### Зависимости не установились?

```bash
rm -rf node_modules package-lock.json
bun install
```

### TypeScript поддержка?

Добавьте в `tsconfig.json` для использования TypeScript вместо JavaScript.

## Дополнительные ресурсы

- [Vue 3 документация](https://vuejs.org)
- [Pinia документация](https://pinia.vuejs.org)
- [Vue Router документация](https://router.vuejs.org)
- [Tailwind CSS документация](https://tailwindcss.com)
- [Vite документация](https://vitejs.dev)

## Лицензия

MIT License

---

**Создано для тестового задания Инфотек**
