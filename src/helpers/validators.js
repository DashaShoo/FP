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


// prop - Returns a function that when supplied an object returns the indicated property of that object, if it exists.
// propEq(propName, value) - Возвращает предикат, проверяющий, что у объекта свойство propName имеет значение value.
// propEq(key, value, obj) - Это функция из Ramda, проверяющая, что в объекте obj у свойства key — значение value.
// allPass([pred1, pred2, ...]) - Создаёт предикат, который вернёт true, только если все предикаты из массива вернут true.
// anyPass([pred1, pred2, ...]) - Создаёт предикат, который вернёт true, если хотя бы один из предикатов вернёт true.
// values(obj) - Возвращает массив значений объекта.
// filter(predicate, array) - Фильтрует элементы массива по предикату.
// countBy(fn, list) - Создаёт объект, в котором ключи — это результат применения fn к каждому элементу, а значения — количество таких элементов.
// toPairs(obj) - Преобразует объект в массив пар [ключ, значение].
// length(array) - Возвращает длину массива.
// pipe(f1, f2, ..., fn) - Создаёт композицию функций слева направо: результат f1 передаётся в f2, и т.д.
// equals(a)(b) или equals(a, b) - Проверяет на строгую равенство (===). Можно каррировать.
// gte(a, b) и gte(__, 2) - Проверка "больше или равно". Вторая форма использует __ — это placeholder (заглушка), позволяющая каррировать аргументы в любом порядке.
// complement(fn) - Создаёт функцию, противоположную по логике: !fn.
// all(predicate, array) - Проверяет, что все элементы массива удовлетворяют предикату.
// identity(x) - Просто возвращает x — полезна как функция по умолчанию.

//Что такое каррирование?
// Функция, принимающая несколько аргументов, превращается в цепочку функций, каждая из которых принимает по одному аргументу:

// // до каррирования
// (color, figure, obj) => propEq(figure, color, obj)

// // после
// isFigureColor('green')('circle')(obj)


import {
  allPass,
  pipe,
  propEq,
  __,
  any,
  curry,
  equals,
  filter,
  length,
  values,
  prop,
  converge,
  identity,
  countBy,
  complement,
  gte,
} from 'ramda';



// Базовый предикат: фигура нужного цвета
const isFigureColor = curry((color, figure, obj) =>
  propEq(figure, color, obj)
);

// Частично применённые предикаты
const isFigureGreen = isFigureColor('green');
const isFigureRed = isFigureColor('red');
const isFigureBlue = isFigureColor('blue');
const isFigureWhite = isFigureColor('white');
const isFigureOrange = isFigureColor('orange');

const isFigureNotRed = complement(isFigureRed);
const isFigureNotWhite = complement(isFigureWhite);

//Подсчёт количества фигур определённого цвета
const countColor = curry((color, obj) =>
  pipe(values, filter(equals(color)), length)(obj)
);


// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  isFigureRed('star'),
  isFigureGreen('square'),
  isFigureWhite('triangle'),
  isFigureWhite('circle'),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(
    countColor('green'), gte(__, 2)
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [countColor('red'), countColor('blue')]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  isFigureRed('star'),
  isFigureOrange('square'),
  isFigureBlue('circle'),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = pipe(
    values,
    filter(complement(equals('white'))),
    countBy(identity),
    values,
    any(gte(__, 3))
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    isFigureGreen('triangle'), pipe(countColor('green'), equals(2)), pipe(countColor('red'), equals(1))
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = converge(equals, [countColor('orange'), pipe( values,  length)]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isFigureNotRed('star'), isFigureNotWhite('star')]);

// 9. Все фигуры зеленые.
export const validateFieldN9 =  converge(equals, [countColor('green'), pipe( values,  length)]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([isFigureNotWhite('triangle'), isFigureNotWhite('square'), converge(equals, [prop('triangle'), prop('square')])])
