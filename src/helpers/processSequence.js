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
import Api from "../tools/api";
import {
  tap,
  allPass,
  test,
  length,
  pipe,
  ifElse,
  gt,
  lt,
  __,
  andThen,
  otherwise,
  prop,
  partial,
  mathMod,
} from "ramda";

const api = new Api();

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const log = tap(writeLog);
  const success = tap(handleSuccess);
  const error = tap(handleError);

  const validate = allPass([
    test(/^[0-9.]+$/), // Только цифры и точки
    pipe(length, gt(__, 2)), // Длина > 2
    pipe(length, lt(__, 10)), // Длина < 10
    pipe(parseFloat, gt(__, 0)), // Положительное число
  ]);

  const roundNumber = pipe(parseFloat, Math.round, log);
  const getBinary = (number) =>
    api.get("https://api.tech/numbers/base", {
      from: 10,
      to: 2,
      number,
    });

  const getAnimal = (id) => api.get(`https://animals.tech/${id}`, {});

  const processValidatedValue = pipe(
    roundNumber,
    getBinary,
    andThen(
      pipe(
        prop("result"),
        log,
        pipe(length, log),
        (length) => length * length,
        log,
        mathMod(__, 3),
        log,
        getAnimal,
        andThen(pipe(prop("result"), success))
      )
    ),
    otherwise(partial(error, ["API Error"]))
  );

  log(value);

  ifElse(
    validate,
    processValidatedValue,
    partial(error, ["ValidationError"])
  )(value);
};

export default processSequence;
