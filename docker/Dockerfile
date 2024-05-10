FROM node:18.16-alpine As builder

# Создадим директорию приложения
RUN mkdir "/app"
WORKDIR /app

# структура каталогов для дампов БД
RUN mkdir dumps
RUN cd dumps
RUN mkdir postgres
RUN cd ../
# права на выполнение скрипта
RUN chmod +x db_dumper.sh
# права на выполнение скрипта восстановления
RUN chmod +x db_recoverer.sh
# права на сохранение дампов
RUN chmod +w -R dumps/postgres

# структура каталогов для логов
RUN mkdir zip
# права на выполнение скрипта архивации логов
RUN chmod +x archivator.sh
# права на сохранение логов
RUN chmod +w -R zip

# Копируем файлы для установки пакетов и призму
COPY package*.json ./
COPY prisma ./prisma/

# Установка пакетов
RUN npm install -g @nestjs/cli
RUN npm install

# Копирование оставшихся файлов
COPY . .

# Билд приложения
RUN npm run build

FROM node:18.16-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Запуск приложения на указанном в .env порту
EXPOSE $APP_PORT
CMD [ "npm", "run", "start:prod" ]