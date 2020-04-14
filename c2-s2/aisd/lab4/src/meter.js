// импорт встроенной библиотеки для замера производительности
import { performance } from "perf_hooks";

const meter = {
  // функция для замера времени выполнения функций
  // первый аргумент - замеряемая функция
  // все последующие - аргументы для замеряемой функции
  async race(func, ...args) {
    // засекаем время
    const t = performance.now();
    // выполняем функцию | имеется небольшой костыль во избежание ошибки из-за контекста
    const result = await (func.run ? func.run.apply(func, args) : func.apply(this, args));
    // возвращаем объект, где { time: время выполнения в мс, result: результат выполнения функции }
    return { time: (performance.now() - t).toFixed(2), result };
  }
};

export default meter;
