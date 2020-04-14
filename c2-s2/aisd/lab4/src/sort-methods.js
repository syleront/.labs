// импорт констант с названиями
import {
  METHOD_ALIAS_INCLUSION,
  METHOD_ALIAS_SELECTION,
  METHOD_ALIAS_BUBBLE,
  METHOD_ALIAS_QUICK
} from "./constants";

// реализация алгоритма сортировки прямым включением (1.4) из методички
export const inclusion = {
  name: METHOD_ALIAS_INCLUSION,
  run(arr) {
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      const x = arr[i];
      let j = i - 1;

      while (x < arr[j] && j >= 0) {
        arr[j + 1] = arr[j];
        j = j - 1;
      }

      arr[j + 1] = x;
    }

    return arr;
  }
};

// реализация алгоритма сортировки прямым выбором (1.5) из методички
export const selection = {
  name: METHOD_ALIAS_SELECTION,
  run(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let x = arr[i];
      let k = i;

      for (let j = i + 1; j < n; j++) {
        if (arr[j] < x) {
          k = j;
          x = arr[j];
        }
      }

      arr[k] = arr[i];
      arr[i] = x;
    }

    return arr;
  }
};

// реализация алгоритма сортировки прямым обменом (1.6) из методички
export const bubble = {
  name: METHOD_ALIAS_BUBBLE,
  run(arr) {
    const n = arr.length;

    for (let i = 0; i < n; i++) {
      for (let j = n; j > i; j--) {
        if (arr[j - 1] > arr[j]) {
          const x = arr[j - 1];
          arr[j - 1] = arr[j];
          arr[j] = x;
        }
      }
    }

    return arr;
  }
};

// реализация алгоритма быстрой сортировки (1.7) из методички
export const quick = {
  name: METHOD_ALIAS_QUICK,
  run(arr, left, right) {
    if (arr.length > 1) {
      left = typeof left !== "number" ? 0 : left;
      right = typeof right !== "number" ? arr.length - 1 : right;

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
