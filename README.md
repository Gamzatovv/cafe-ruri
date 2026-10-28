# РУРИ — production deployment

Сайт ресторана на React + FastAPI + SQLite + Docker + Nginx.

## Что есть

- Корзина хранится в браузере (`localStorage`) и не хранится на backend.
- Заказы и заявки на обратный звонок отправляются по SMTP на `ORDER_EMAIL`.
- Дата и время письма заказа — по Москве (`Europe/Moscow`).
- Админка защищена backend-паролем `ADMIN_PASSWORD`.
- Создание/изменение/удаление товаров требуют правильный admin password.
- Картинки загружаются на сервер и хранятся в Docker volume `ruri_backend_data`.
- Backend не опубликован наружу: доступ к нему идёт только через Nginx.
- Swagger/OpenAPI отключены в production.
- Nginx добавляет rate limit для входа в админку и базовые security headers.

## 1. Подготовка VPS

Нужен сервер с Docker и Docker Compose plugin. Откройте только TCP 80 и 443 (SSH 22 — по необходимости).

## 2. Настройка домена

Скопируйте `.env.example` в `.env` и обязательно задайте длинный случайный пароль:

```bash
cp .env.example .env
nano .env
```

Настройте домен:

```bash
./scripts/set-domain.sh example.ru
```

Замените `example.ru` на настоящий домен.

## 3. DNS

Создайте DNS A-запись домена на публичный IPv4 VPS. Если используете IPv6 — добавьте AAAA.

До получения сертификата проверьте, что:

```text
http://example.ru
```

открывается с сервера.

## 4. Запуск

```bash
docker compose up -d --build
```

Проверка:

```bash
docker compose ps
docker compose logs nginx --tail=100
docker compose logs backend --tail=100
```

## 5. HTTPS

Nginx уже подготовлен под Let's Encrypt. Пока сертификата нет, используется HTTP-сервер.

Получите сертификат через Certbot на VPS (вариант с host certbot):

```bash
sudo certbot certonly --webroot -w ./nginx/certbot/www -d example.ru -d www.example.ru
```

После получения сертификата раскомментируйте HTTPS `server` в `nginx/conf.d/ruri.conf`, заменив домен если нужно, и затем:

```bash
docker compose restart nginx
```

После включения HTTPS желательно перенаправить HTTP на HTTPS. Это можно сделать в HTTP server, заменив обычную обработку запросов на `return 301 https://$host$request_uri;`, оставив `.well-known/acme-challenge/` выше него.

## 6. Безопасность

Не публикуйте `8000`. В production наружу должны быть доступны только 80/443.

Не коммитьте `.env` в Git.

Не используйте `docker compose down -v` без необходимости: это удалит volume с базой и картинками.

Пароль Gmail App Password храните в `.env`; backend автоматически убирает пробелы и дефисы при SMTP login.

## 7. Backup

База SQLite и картинки находятся в volume `ruri_backend_data`.

Сделать backup:

```bash
./scripts/backup.sh
```

Рекомендуется запускать это по cron ежедневно и хранить копии не только на VPS.

## 8. Обновление сайта

```bash
git pull
docker compose build --no-cache
docker compose up -d
```

## 9. Проверка после запуска

- Открывается сайт по HTTPS.
- `/api/docs` не доступен.
- Админка принимает только правильный `ADMIN_PASSWORD`.
- Неверный пароль даёт 401.
- Создание/изменение/удаление товаров без admin password даёт 401.
- Заказ приходит на `ORDER_EMAIL`.
- Заявка на обратный звонок приходит на `ORDER_EMAIL`.
- В письме заказа нет номера заказа, есть дата/время Москвы.
- Загруженная картинка переживает пересоздание контейнеров.
- Backup создаётся без ошибок.
