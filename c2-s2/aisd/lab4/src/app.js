// импорт конфига
import "./config";

// импорт замерщика времени выполнения функции
import meter from "./meter";
// импорт ручного заполнения массива
import manualArrayInput from "./manual-array-input";

// импорт csv генератора для результатов
import CSVGenerator from "./csvgen";
// импорт менеджера результатов
import ResultsManager from "./results-manager";

// импорт методов сортировки и генерации массивов в объекты соотвественно
import * as ArraySortMethods from "./sort-methods";
import * as ArrayGenMethods from "./array-generators";

// импорт констант
import {
  ARRAY_SIZES,
  ARRAY_MIN_VALUE,
  ARRAY_MAX_VALUE,
  CSV_NEEDED,
  CSV_OUTPUT_PATH,
  MANUAL_INPUT
} from "./constants";

// основная async функция программы
(async function main() {
  // если в .env CSV=true, то создаем экземпляры для создания csv, и записи результатов
  const csv = CSV_NEEDED ? new CSVGenerator() : null;
  const results = CSV_NEEDED ? new ResultsManager() : null;

  // конвертируем значения объектов для генерации и сортировки в массивы
  const genMethodsArray = Object.values(ArrayGenMethods);
  const sortMethodsArray = Object.values(ArraySortMethods);

  // проходимся циклом по методам генерации
  for (const currentGenMethod of genMethodsArray) {
    // если нужен csv, то очищаем результаты для текущего метода генерации
    if (csv) results.clear();

    console.log(`\n\nПорядок массива: ${currentGenMethod.name}`);

    // проходимся циклом по размерам массива
    for (const currentSize of ARRAY_SIZES) {
      console.log(`\nКоличество элементов: ${currentSize}`);

      // если текущее количество элементов = 20, и в .env MANUAL_INPUT=true
      // то спрашиваем элементы массива у пользователя
      // иначе - генерируем текущим методом
      const array = currentSize === 20 && MANUAL_INPUT === true
        ? await manualArrayInput(currentSize)
        : currentGenMethod.run(currentSize, ARRAY_MIN_VALUE, ARRAY_MAX_VALUE);

      // проходимся циклом по методам сортировки
      for (const currentSortMethod of sortMethodsArray) {
        // деструктурируем текущее имя метода
        const { name } = currentSortMethod;
        // передаем функцию и аргументы для нее, и деструктурируем time из результата замера
        // используем .slice() для создания копии массива (т.к. иначе - передается ссылка)
        const { time } = await meter.race(currentSortMethod, array.slice());
        console.log(`${name}: ${time}ms`);

        // если нужен csv, то записываем результат текущего метода сортировки для текущего метода генерации
        if (csv) {
          const { name } = currentSortMethod;
          results.add(name, time);
        }
      }
    }

    // если нужен csv, то добавляем строки в виде
    // Имя_Метода
    // ;размеры;массивов;n;
    // Метод_Генерации;для_размера_1;для_размера_2;и т.д.
    if (csv) {
      csv.addRow();
      csv.addRow(currentGenMethod.name);
      csv.addRow([null, ...ARRAY_SIZES]);

      Object.entries(results.get()).forEach(([name, timings]) => {
        csv.addRow([name, ...timings]);
      });
    }
  }

  // если нужен csv, то записываем его в файл
  if (csv) await csv.writeToFile(CSV_OUTPUT_PATH);
})();
