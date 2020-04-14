import {
  ARRAY_ALIAS_GENERATOR_RANDOM,
  ARRAY_ALIAS_GENERATOR_SORTED,
  ARRAY_ALIAS_GENERATOR_REVERSED,
  ARRAY_ALIAS_GENERATOR_THIRD_SORTED,
  ARRAY_ALIAS_GENERATOR_TWOTHIRDS_SORTED
} from "./constants";

// случайно заполненный массив
export const random = {
  name: ARRAY_ALIAS_GENERATOR_RANDOM,
  run(length, max, min) {
    return Array.from({ length }, () => Math.round(Math.random() * (max - min)) + min);
  }
};

// отсортированный массив
export const sorted = {
  name: ARRAY_ALIAS_GENERATOR_SORTED,
  run(length) {
    return Array.from({ length }, (e, i) => i);
  }
};

// обратно отсортированный массив
export const reverseSorted = {
  name: ARRAY_ALIAS_GENERATOR_REVERSED,
  run(length) {
    return Array.from({ length }, (e, i) => length - i);
  }
};

// отсортированный на 1/3 массив
export const thirdSorted = {
  name: ARRAY_ALIAS_GENERATOR_THIRD_SORTED,
  run(length, min, max) {
    const target = length / 3;
    return Array.from({ length }, (e, i) => i > target ? Math.round(Math.random() * (max - min)) + min : i);
  }
};

// отсортированный на 2/3 массив
export const twoThirdsSorted = {
  name: ARRAY_ALIAS_GENERATOR_TWOTHIRDS_SORTED,
  run(length, min, max) {
    const target = length * 2 / 3;
    return Array.from({ length }, (e, i) => i > target ? Math.round(Math.random() * (max - min)) + min : i);
  }
};
