# Используем официальный образ Playwright с предустановленными браузерами
FROM mcr.microsoft.com/playwright:v1.58.1-jammy

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости (включая devDependencies)
RUN npm ci

# Копируем все остальные файлы проекта (тесты, конфиги, страницы)
COPY . .

# По умолчанию запускаем тесты (но в CI это переопределим)
CMD ["npx", "playwright", "test", "--grep", "@smoke"]