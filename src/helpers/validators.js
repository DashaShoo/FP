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
// R.propEq(propName, value) - Возвращает предикат, проверяющий, что у объекта свойство propName имеет значение value.
// R.propEq(key, value, obj) - Это функция из Ramda, проверяющая, что в объекте obj у свойства key — значение value.
// R.allPass([pred1, pred2, ...]) - Создаёт предикат, который вернёт true, только если все предикаты из массива вернут true.
// R.anyPass([pred1, pred2, ...]) - Создаёт предикат, который вернёт true, если хотя бы один из предикатов вернёт true.
// R.values(obj) - Возвращает массив значений объекта.
// R.filter(predicate, array) - Фильтрует элементы массива по предикату.
// R.countBy(fn, list) - Создаёт объект, в котором ключи — это результат применения fn к каждому элементу, а значения — количество таких элементов.
// R.toPairs(obj) - Преобразует объект в массив пар [ключ, значение].
// R.length(array) - Возвращает длину массива.
// R.pipe(f1, f2, ..., fn) - Создаёт композицию функций слева направо: результат f1 передаётся в f2, и т.д.
// R.equals(a)(b) или R.equals(a, b) - Проверяет на строгую равенство (===). Можно каррировать.
// R.gte(a, b) и R.gte(R.__, 2) - Проверка "больше или равно". Вторая форма использует R.__ — это placeholder (заглушка), позволяющая каррировать аргументы в любом порядке.
// R.complement(fn) - Создаёт функцию, противоположную по логике: !fn.
// R.all(predicate, array) - Проверяет, что все элементы массива удовлетворяют предикату.
// R.identity(x) - Просто возвращает x — полезна как функция по умолчанию.

//Что такое каррирование?
// Функция, принимающая несколько аргументов, превращается в цепочку функций, каждая из которых принимает по одному аргументу:

// // до каррирования
// (color, figure, obj) => R.propEq(figure, color, obj)

// // после
// isFigureColor('green')('circle')(obj)



import * as R from 'ramda';


// Базовый предикат: фигура нужного цвета
const isFigureColor = R.curry((color, figure, obj) =>
  R.propEq(figure, color, obj)
);

// Частично применённые предикаты
const isFigureGreen = isFigureColor('green');
const isFigureRed = isFigureColor('red');
const isFigureBlue = isFigureColor('blue');
const isFigureWhite = isFigureColor('white');
const isFigureOrange = isFigureColor('orange');

const isFigureNotRed = R.complement(isFigureRed);
const isFigureNotWhite = R.complement(isFigureWhite);

//Подсчёт количества фигур определённого цвета
const countColor = R.curry((color, obj) =>
  R.pipe(R.values, R.filter(R.equals(color)), R.length)(obj)
);


// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = R.allPass([
  isFigureRed('star'),
  isFigureGreen('square'),
  isFigureWhite('triangle'),
  isFigureWhite('circle'),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = R.pipe(
    countColor('green'), R.gte(R.__, 2)
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = R.converge(R.equals, [countColor('red'), countColor('blue')]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = R.allPass([
  isFigureRed('star'),
  isFigureOrange('square'),
  isFigureBlue('circle'),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (obj) => {
  return R.pipe(
    R.values,
    R.filter(R.complement(R.equals('white'))),
    R.countBy(R.identity),
    R.values,
    R.any(R.gte(R.__, 3))
  )(obj);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = R.allPass([
    isFigureGreen('triangle'), R.pipe(countColor('green'), R.equals(2)), R.pipe(countColor('red'), R.equals(1))
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = R.converge(R.equals, [countColor('orange'), R.pipe( R.values,  R.length)]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = R.allPass([isFigureNotRed('star'), isFigureNotWhite('star')]);

// 9. Все фигуры зеленые.
export const validateFieldN9 =  R.converge(R.equals, [countColor('green'), R.pipe( R.values,  R.length)]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = R.allPass([isFigureNotWhite('triangle'), isFigureNotWhite('square'), R.converge(R.equals, [R.prop('triangle'), R.prop('square')])])
