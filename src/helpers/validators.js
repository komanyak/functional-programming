/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  allPass,
  anyPass,
  complement,
  countBy,
  equals,
  filter,
  identity,
  length,
  pipe,
  prop,
  propEq,
  values,
  converge,
  all,
  any,
  both,
} from "ramda";

const getColors = values;
const countColor = (color) => pipe(getColors, filter(equals(color)), length);
const hasColor = (shape, color) => propEq(shape, color);
const hasExactCount = (count, color) => pipe(countColor(color), equals(count));
const hasMinCount = (min, color) => pipe(countColor(color), (n) => n >= min);
const allSameColor = (color) => pipe(getColors, all(equals(color)));
const notWhite = complement(equals("white"));
const notRedOrWhite = complement(anyPass([equals("red"), equals("white")]));

// 1. Красная звезда, зеленый квадрат, все остальные белые
export const validateFieldN1 = allPass([
  hasColor("star", "red"),
  hasColor("square", "green"),
  hasColor("triangle", "white"),
  hasColor("circle", "white"),
]);

// 2. Как минимум две фигуры зеленые
export const validateFieldN2 = hasMinCount(2, "green");

// 3. Количество красных фигур равно кол-ву синих
export const validateFieldN3 = converge(equals, [
  countColor("red"),
  countColor("blue"),
]);

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = allPass([
  hasColor("circle", "blue"),
  hasColor("star", "red"),
  hasColor("square", "orange"),
]);

// 5. Три+ фигуры одного цвета (кроме белого)
export const validateFieldN5 = pipe(
  getColors,
  filter(notWhite),
  countBy(identity),
  values,
  any((count) => count >= 3)
);

// 6. Ровно две зеленые фигуры (треугольник - зеленый), одна красная
export const validateFieldN6 = allPass([
  hasExactCount(2, "green"),
  hasColor("triangle", "green"),
  hasExactCount(1, "red"),
]);

// 7. Все фигуры оранжевые
export const validateFieldN7 = allSameColor("orange");

// 8. Не красная и не белая звезда
export const validateFieldN8 = pipe(prop("star"), notRedOrWhite);

// 9. Все фигуры зеленые
export const validateFieldN9 = allSameColor("green");

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = both(
  converge(equals, [prop("triangle"), prop("square")]),
  pipe(prop("triangle"), notWhite)
);
