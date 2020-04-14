function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var dotenv = _interopDefault(require('dotenv'));
var perf_hooks = require('perf_hooks');
var readline = _interopDefault(require('readline'));
var fs = _interopDefault(require('fs'));

// импорт и инициализация библиотеки для чтения .env
dotenv.config();

// импорт встроенной библиотеки для замера производительности

const meter = {
  // функция для замера времени выполнения функций
  // первый аргумент - замеряемая функция
  // все последующие - аргументы для замеряемой функции
  async race(func, ...args) {
    // засекаем время
    const t = perf_hooks.performance.now();
    // выполняем функцию | имеется небольшой костыль во избежание ошибки из-за контекста
    const result = await (func.run ? func.run.apply(func, args) : func.apply(this, args));
    // возвращаем объект, где { time: время выполнения в мс, result: результат выполнения функции }
    return { time: (perf_hooks.performance.now() - t).toFixed(2), result };
  }
};

// Promise обертка чтения ввода пользователя, для использования в async функциях
function input(question = "") {
  // возвращаем новый Promise
  return new Promise((resolve) => {
    // создаем интерфейс для чтения ввода
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // задаем вопрос
    rl.question(`${question} `, (answer) => {
      // получаем ответ, закрываем интерфейс
      rl.close();
      // отдаем ответ
      resolve(answer);
    });
  });
}

// импорт обертки над readline

async function manualArrayInput(length) {
  // объявляем переменную, где будет массив
  let array = null;

  while (array === null) {
    // запрашиваем ввод с консоли
    const answer = await input(`Введите ${length} элементов через пробел:`);

    try {
      // сплитим входную строку по пробелам
      const splitted = answer.split(/\s+/);

      // если количество элементов != нужной длине, кидаем ошибку
      // если нет - конвертируем все входные значения в числа, и присваиваем значение array
      if (splitted.length !== length) {
        throw new Error(`введено элементов: ${splitted.length}, нужно: ${length}`);
      } else {
        array = splitted.map((e) => Number(e));
      }
    } catch (e) {
      console.error(`Допущена ошибка при вводе: ${e.message}`);
    }
  }

  // создаем и возвращаем НОВЫЙ массив, во избежание потери оптимизации массивов у v8
  // см. https://habr.com/ru/company/oleg-bunin/blog/417459/
  return Array.from({ length }, (e, i) => array[i]);
}

// импорт библиотеки для работы с файловой системой

class CSVGenerator {
  constructor() {
    // внутренний массив со значениями экземпляра класса
    this._csvArray = [];
  }

  // метод для добавления значения в последнюю строку текущего csv
  add(items) {
    this._csvArray[this._csvArray.length - 1].push(...items);
    return true;
  }

  // метод для добавления новой строки
  // если передан items, то создает строку со значением/значениями
  addRow(items) {
    if (typeof items !== "undefined" && !Array.isArray(items)) items = [items];
    this._csvArray.push(typeof items !== "undefined" ? [...items] : []);
    return true;
  }

  // метод для конвертации массива экземпляра в обычную строку
  build() {
    return this._csvArray
      .map((e) => e === null || typeof e === "undefined" ? "" : e)
      .map((e) => e.join(";"))
      .join("\n");
  }

  // метод для записи текущего массива экземпляра в файл
  async writeToFile(path) {
    const data = this.build();

    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}

// суть менеджера - уменьшить визуальный мусор в главном файле
class ResultsManager {
  constructor() {
    this._results = {};
  }

  add(prop, value) {
    if (this._results[prop]) {
      this._results[prop].push(value);
    } else {
      this._results[prop] = [value];
    }
  }

  clear() {
    this._results = {};
  }

  get() {
    return this._results;
  }
}

// параметры для массивов
const ARRAY_SIZES = [20, 500, 1000, 3000, 5000, 10000];
const ARRAY_MIN_VALUE = 0;
const ARRAY_MAX_VALUE = 100;

// алиасы методов генерации массивов
const ARRAY_ALIAS_GENERATOR_RANDOM = "Случайный порядок";
const ARRAY_ALIAS_GENERATOR_SORTED = "Отсортированный";
const ARRAY_ALIAS_GENERATOR_REVERSED = "Обратный порядок";
const ARRAY_ALIAS_GENERATOR_THIRD_SORTED = "Частично отсортированный (1/3 массива)";
const ARRAY_ALIAS_GENERATOR_TWOTHIRDS_SORTED = "Частично отсортированный (2/3 массива)";

// названия методов сортировки
const METHOD_ALIAS_INCLUSION = "Прямое включение (1.4)";
const METHOD_ALIAS_SELECTION = "Прямой выбор (1.5)";
const METHOD_ALIAS_BUBBLE = "Прямой обмен (1.6)";
const METHOD_ALIAS_QUICK = "Быстрая сортировка (1.7)";

// константы для генерации csv
// если env переменная CSV = "true", то CSV_NEEDED = true
const CSV_NEEDED = process.env.CSV === "true";
// путь выходного .csv файла
const CSV_OUTPUT_PATH = "./results.csv";

// если env переменная MANUAL_INPUT = "true", то MANUAL_INPUT = true
const MANUAL_INPUT = process.env.MANUAL_INPUT === "true";

// импорт констант с названиями

// реализация алгоритма сортировки прямым включением (1.4) из методички
const inclusion = {
  name: METHOD_ALIAS_INCLUSION,
  run(arr) {
    const n = arr.length;
    //let sd = 0;

    for (let i = 1; i < n; i++) {
      const x = arr[i];
      let j = i - 1;

      while (x < arr[j] && j >= 0) {
        //sd += 1;
        arr[j + 1] = arr[j];
        j = j - 1;
      }

      //sd += 1;
      arr[j + 1] = x;
    }

    //console.log("ВКЛЮЧЕНИЕ:", sd);

    return arr;
  }
};

// реализация алгоритма сортировки прямым выбором (1.5) из методички
const selection = {
  name: METHOD_ALIAS_SELECTION,
  run(arr) {
    const n = arr.length;
    //let sd = 0;

    for (let i = 0; i < n - 1; i++) {
      let x = arr[i];
      let k = i;

      for (let j = i + 1; j < n; j++) {
        if (arr[j] < x) {
          k = j;
          x = arr[j];
        }
      }

      //sd += 2;

      arr[k] = arr[i];
      arr[i] = x;
    }

    //console.log("ВЫБОР:", sd);

    return arr;
  }
};

// реализация алгоритма сортировки прямым обменом (1.6) из методички
const bubble = {
  name: METHOD_ALIAS_BUBBLE,
  run(arr) {
    const n = arr.length;
    //let sd = 0;

    for (let i = 0; i < n; i++) {
      for (let j = n; j > i; j--) {
        if (arr[j - 1] > arr[j]) {
          //sd += 2;
          const x = arr[j - 1];
          arr[j - 1] = arr[j];
          arr[j] = x;
        }
      }
    }

    //console.log("ОБМЕН", sd);

    return arr;
  }
};

// реализация алгоритма быстрой сортировки (1.7) из методички
const quick = {
  name: METHOD_ALIAS_QUICK,
  run(arr, left, right) {
    if (arr.length > 1) {
      left = typeof left != "number" ? 0 : left;
      right = typeof right != "number" ? arr.length - 1 : right;

      let pivot = arr[Math.floor((right + left) / 2)],
        i = left,
        j = right;

      while (i <= j) {
        while (arr[i] < pivot) {
          i++;
        }

        while (arr[j] > pivot) {
          j--;
        }

        if (i <= j) {
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          i++;
          j--;
        }
      }

      if (left < i - 1) {
        this.run(arr, left, i - 1);
      }

      if (i < right) {
        this.run(arr, i, right);
      }
    }

    return arr;
  }
};

var ArraySortMethods = /*#__PURE__*/Object.freeze({
  __proto__: null,
  inclusion: inclusion,
  selection: selection,
  bubble: bubble,
  quick: quick
});

// случайно заполненный массив
const random = {
  name: ARRAY_ALIAS_GENERATOR_RANDOM,
  run(length, max, min) {
    return Array.from({ length }, () => Math.round(Math.random() * (max - min)) + min);
  }
};

// отсортированный массив
const sorted = {
  name: ARRAY_ALIAS_GENERATOR_SORTED,
  run(length) {
    return Array.from({ length }, (e, i) => i);
  }
};

// обратно отсортированный массив
const reverseSorted = {
  name: ARRAY_ALIAS_GENERATOR_REVERSED,
  run(length) {
    return Array.from({ length }, (e, i) => length - i);
  }
};

// отсортированный на 1/3 массив
const thirdSorted = {
  name: ARRAY_ALIAS_GENERATOR_THIRD_SORTED,
  run(length, min, max) {
    const target = length / 3;
    return Array.from({ length }, (e, i) => i > target ? Math.round(Math.random() * (max - min)) + min : i);
  }
};

// отсортированный на 2/3 массив
const twoThirdsSorted = {
  name: ARRAY_ALIAS_GENERATOR_TWOTHIRDS_SORTED,
  run(length, min, max) {
    const target = length * 2 / 3;
    return Array.from({ length }, (e, i) => i > target ? Math.round(Math.random() * (max - min)) + min : i);
  }
};

var ArrayGenMethods = /*#__PURE__*/Object.freeze({
  __proto__: null,
  random: random,
  sorted: sorted,
  reverseSorted: reverseSorted,
  thirdSorted: thirdSorted,
  twoThirdsSorted: twoThirdsSorted
});

// импорт конфига

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
//# sourceMappingURL=bundle.js.map
