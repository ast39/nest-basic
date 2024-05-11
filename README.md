<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

### Описание

Базовый скелет для написания API на NestJS"

https://github.com/ast39/nest-basic

### Установка

```
# Установка пакетов
yarn install

# Копирование шаблона для env настроек проекта 
cp .env.example .env
```

### Управление Prisma ORM

```
# Инициализация Prisma
yarn prisma init

# Версия пакета
yarn run prisma:version

# Дебаг
yarn run prisma:debug

# Форматирование Prisma схемы
yarn run prisma:format

# Валидация Prisma схемы
yarn run prisma:validate

# Обновление Prisma Client по схеме  
yarn run prisma:generate

# Синхронизация из БД в схему 
yarn run prisma:pull

# Синхронизация из схемы в БД 
yarn run prisma:push

# Наполнение БД начальными данными 
yarn run prisma:seed

# Создание миграции без исполнения
yarn run prisma migrate:create

# Устранение проблем с миграциями базы данных
yarn run prisma migrate:resolve

# Обновление базы данных по неисполненным миграциям в прод. режиме
yarn run prisma migrate:deploy

# Обновление базы данных по неисполненным миграциям в прод. режиме
yarn run prisma migrate:reset
```

### Запуск приложения

```
# В режиме разработки
run run start:dev

# В продакшн режиме
run run start:prod
```

### О проекте

Карказ создан для удобной и быстрой развертки нового проекта и для экономии времени на базовой настройке API.

### Авторы

- Author - [ASt](https://github.com/ast39)
- Telegram - [@ASt39](https://t.me/ASt39)

### Лицензия
ASt-Group

### Модуль дампов БД

---
#### Структура:

- dumps
- - postgres
- - - 2024-04-21T11:00:00_pmp_postgres.sql
- - - ...
- - - 2024-04-23T11:00:00_pmp_postgres.sql
- .env
- db_dumper.sh

---
#### Файл .env
```dotenv
### Container

API_CONTAINER=ast_nest_api
POSTGRES_CONTAINER=ast_nest_postgres
POSTGRES_DUMP_PATH=dumps/postgres


### Database

POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=qwerty
POSTGRES_DB=postgres
```

---
#### Настроить права на файловую систему
```bash
# Восстановить структуру каталогов
mkdir dumps
cd dumps
mkdir postgres
 
# права на выполнение скрипта
chmod +x bash/db_dumper.sh

# права на выполнение скрипта восстановления
chmod +x bash/db_recoverer.sh

# права на сохранение дампов
chmod +w -R dumps/postgres
```

---
Команды
```bash
# Запуск докера
docker-compose up -d

# Создание дампа
./db_dumper.sh

# Восстановление из дампа
./db_recoverer.sh {DUMP_NAME}

# Пример восстановления:
./db_recoverer.sh 2024-04-23T13-52-14_pmp_postgres.sql
```
---
