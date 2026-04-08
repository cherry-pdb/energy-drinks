# Energy App

Моя коллекция энергетиков.

Стек: React (Vite), ASP.NET Core API, JWT для админа, nginx + HTTPS.

## Переменные (находятся в файле `.env`)

| Переменная | Назначение |
|------------|------------|
| `POSTGRES_USER` | Пользователь для подключения к БД |
| `POSTGRES_PASSWORD` | Пароль для подключения к БД |
| `POSTGRES_DB` | Название БД, к которой нужно подключиться |
| `POSTGRES_HOST` | Имя контейнера postgres в docker-сети |
| `POSTGRES_PORT` | Порт на котором крутится postgres (порт внутри контейнера БД) |
| `ENERGY_RUN_MIGRATIONS_ON_STARTUP` | `true` — один инстанс API; `false` — несколько реплик, миграции вручную: `dotnet ef database update --project backend/Energy.Api` |
| `DOMAIN`, `CORS_ALLOWED_ORIGINS` | Домен и origin фронта |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET` | Админ и секрет JWT |

Backend в `docker-compose.yml` подключён к внешней сети `infra_net` (должна существовать на сервере). Другое имя сети — поправьте `docker-compose.yml`. Локально без сети: `docker network create infra_net` или временно уберите `infra_net` у сервиса `backend`.

## Docker

```bash
docker compose up -d --build
```

Вход администратора — боковая панель на сайте, учётные данные из `.env` (позже поправлю на адекватное хранение пользователей в бд).

С сервисом можно ознакомиться [тут](http://energy.nmv-services.ru).