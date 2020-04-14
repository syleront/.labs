## Шаги по запуску проекта
Для сборки и запуска понадобится [Node.JS](https://nodejs.org)
1. Устанавливаем зависимости
    ```
    npm install
    ```
2. Собираем проект
    ```
    npm run debug-build
    ```
3. Запускаем файл
    ```
    node dist/debug/bundle.js
    ```
## Настройки .env
* **CSV** - ***Boolean*** - Генерация csv файла с результатами
* **MANUAL_INPUT** - ***Boolean*** - Ручной ввод 20 элементов массива
