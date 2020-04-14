import readline from "readline";

// Promise обертка чтения ввода пользователя, для использования в async функциях
export default function input(question = "") {
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
