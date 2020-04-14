// импорт библиотеки для работы с файловой системой
import fs from "fs";

export default class CSVGenerator {
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
