/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';

import {
    test,
    pipe,
    length,
    gt,
    __,
    allPass,
    lt,
    not,
    modulo,
    tap,
    ifElse,
    andThen,
} from 'ramda';



//api
const api = new Api();
const params = (number) => ({
    number,
    from: 10,
    to: 2,
});
const getNumber = (number) => api.get("https://api.tech/numbers/base", params(number));
const getAnimal = (id) => api.get(`https://animals.tech/${id}`, id);



//validation
const isNumberString = test(/^[0-9.]+$/); 
const isNotContainMinus = pipe(test(/-/), not);
const hasMaxOneDot = (str) => (str.match(/\./g) || []).length <= 1;
const isMoreThan2 = pipe(length, gt(__, 2));
const isLessThan10 = pipe(length, lt(__, 10));
const isValidValue = allPass([
  isNumberString,
  isNotContainMinus,
  hasMaxOneDot,
  isMoreThan2,
  isLessThan10,
]);



//parsing
const toRoundNumber = pipe(parseFloat, Math.round);
const toSquare = (value) => value ** 2;
const toMod3 = modulo(__, 3);
const getResult = ({ result }) => result;


// 1. Берем строку N. Пишем изначальную строку в writeLog.
// 2. Строка валидируется по следующим правилам:
// кол-во символов в числе должно быть меньше 10.
// кол-во символов в числе должно быть больше 2.
// число должно быть положительным
// символы в строке только [0-9] и точка т.е. число в 10-ной системе счисления (возможно с плавающей запятой)
// В случае ошибки валидации вызвать handleError с 'ValidationError' строкой в качестве аргумента
// 3. Привести строку к числу, округлить к ближайшему целому с точностью до единицы, записать в writeLog.
// 4. C помощью API /numbers/base перевести из 10-й системы счисления в двоичную, результат записать в writeLog
// 5. Взять кол-во символов в полученном от API числе записать в writeLog
// 6. Возвести в квадрат с помощью Javascript записать в writeLog
// 7. Взять остаток от деления на 3, записать в writeLog
// 9. C помощью API /animals.tech/id/name получить случайное животное используя полученный остаток в качестве id
// 10. Завершить цепочку вызовом handleSuccess в который в качестве аргумента положить результат полученный на предыдущем шаге

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const log = tap(writeLog);
    const handleValidationError = () => handleError('ValidationError');
    const handleApiError = () => handleError('ServerError');


    const requestAnimal = pipe(
        log,
        length,
        log,
        toSquare,
        log,
        toMod3,
        log,
        getAnimal,
        andThen(getResult),
        andThen(handleSuccess),
        (p) => p.catch(handleApiError)
    );


    const requestNumber = pipe(
        log,
        toRoundNumber,
        log,
        getNumber,
        andThen(getResult),
        andThen(requestAnimal),
        (p) => p.catch(handleApiError)
    );


    const process = ifElse(isValidValue, requestNumber, handleValidationError);

    process(value);
}

export default processSequence;
