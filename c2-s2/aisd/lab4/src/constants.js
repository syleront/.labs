// параметры для массивов
export const ARRAY_SIZES = [20, 500, 1000, 3000, 5000, 10000];
export const ARRAY_MIN_VALUE = 0;
export const ARRAY_MAX_VALUE = 100;

// алиасы методов генерации массивов
export const ARRAY_ALIAS_GENERATOR_RANDOM = "Случайный порядок";
export const ARRAY_ALIAS_GENERATOR_SORTED = "Отсортированный";
export const ARRAY_ALIAS_GENERATOR_REVERSED = "Обратный порядок";
export const ARRAY_ALIAS_GENERATOR_THIRD_SORTED = "Частично отсортированный (1/3 массива)";
export const ARRAY_ALIAS_GENERATOR_TWOTHIRDS_SORTED = "Частично отсортированный (2/3 массива)";

// названия методов сортировки
export const METHOD_ALIAS_INCLUSION = "Прямое включение (1.4)";
export const METHOD_ALIAS_SELECTION = "Прямой выбор (1.5)";
export const METHOD_ALIAS_BUBBLE = "Прямой обмен (1.6)";
export const METHOD_ALIAS_QUICK = "Быстрая сортировка (1.7)";

// константы для генерации csv
// если env переменная CSV = "true", то CSV_NEEDED = true
export const CSV_NEEDED = process.env.CSV === "true";
// путь выходного .csv файла
export const CSV_OUTPUT_PATH = "./results.csv";

// если env переменная MANUAL_INPUT = "true", то MANUAL_INPUT = true
export const MANUAL_INPUT = process.env.MANUAL_INPUT === "true";
