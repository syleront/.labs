// импорт обертки над readline
import input from "./input";

export default async function manualArrayInput(length) {
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
