'use strict';

(function () {
  /**
   * Генерирует случайное число в пределах заданных параметров
   * @param {number} to - максимальное значение случайного числа
   * @param {number} from - минимальное значение случайного числа
   * @return {number}
   */
  var getRandomNumber = function (to, from) {
    from = from || 0;

    return Math.round(Math.random() * (to - from) + from);
  };

  /**
   * Возвращает случайный элемент массива
   * @param {Array} arr - массив, из которого необходимо выбрать случайный элемент
   * @param {boolean} getUniqueItem - определяет, вырезать или копировать выбранный элемент из изсходного массива
   * @return {Array<any>}
   */
  var getRandomElement = function (arr, getUniqueItem) {
    var elementIndex = getRandomNumber(arr.length - 1);
    var randomElement = arr[elementIndex];

    if (getUniqueItem) {
      arr.splice(elementIndex, 1);
    }

    return randomElement;
  };

  /**
   * Возвращает массив из заданного количества случайных элементов переданного массива.
   * @param {Array} arr - исходный массив, из которого необходимо выбрать элементы
   * @param {number} count - необязательный параметр количества элементов, которые нужно выбрать. По умолчанию равен суммарному количеству элементов.
   * @return {Array}
   */
  var getRandomElements = function (arr, count) {
    arr = arr.slice(0);
    count = count || getRandomNumber(arr.length);
    var resultArray = [];

    for (var i = 0; i < count; i++) {
      resultArray.push(getRandomElement(arr, true));
    }

    return resultArray;
  };

  var random = {
    number: getRandomNumber,
    element: getRandomElement,
    elements: getRandomElements
  };

  window.random = random;
})();
