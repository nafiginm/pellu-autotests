# Используем официальный образ Playwright с предустановленными браузерами
FROM mcr.microsoft.com/playwright:v1.58.1-jammy
# Устанавливаем Java (нужна для Allure)
RUN apt-get update && apt-get install -y openjdk-11-jre-headless && apt-get clean
# Устанавливаем Allure CLI
RUN apt-get update && apt-get install -y wget && \
    wget https://github.com/allure-framework/allure2/releases/download/2.24.0/allure-2.24.0.tgz && \
    tar -zxvf allure-2.24.0.tgz -C /opt/ && \
    ln -s /opt/allure-2.24.0/bin/allure /usr/bin/allure && \
    rm allure-2.24.0.tgz
# Устанавливаем рабочую директорию
WORKDIR /app
# Копируем файлы зависимостей
COPY package*.json ./
# Устанавливаем зависимости (включая devDependencies)
RUN npm ci
# Создаем папку для результатов Allure
RUN mkdir -p allure-results allure-report
# Копируем все остальные файлы проекта (тесты, конфиги, страницы)
COPY . .
# По умолчанию запускаем тесты (но в CI это переопределим)
CMD ["npx", "playwright", "test", "--grep", "@smoke"]