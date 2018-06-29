'use strict';

(function () {
  /**
   * Сравнивает параметры введенные в форму-фильтр  и переданные в похожие объявления с сервера
   * @param {any} key
   * @param {any} advert
   * @param {Object} filterFormContent
   * @return {Boolean}
   */
  var comparesAdvertsForm = function (key, advert, filterFormContent) {
    var result;

    switch (key) {
      case ('type'):
        result = (advert.offer[key] === filterFormContent[key]);
        break;
      case ('rooms'):
        result = (advert.offer[key] === +filterFormContent[key]);
        break;
      case ('guests'):
        result = (advert.offer[key] === +filterFormContent[key]);
        break;
      case ('price'):
        result = comparesPrices(advert.offer[key], filterFormContent[key]);
        break;
      case ('features'):
        result = comparesFeatures(advert.offer[key], filterFormContent[key]);
        break;
      default:
        result = false;
    }

    return result;
  };

  /**
   * Сравнивает числовое значение цены в объявлении с текстовым значением аналогичного поля в форме-фильтр
   * @param {Number} advertValue
   * @param {String} formValue
   * @return {Boolean}
   */
  var comparesPrices = function (advertValue, formValue) {
    var result;

    switch (formValue) {
      case ('low'):
        result = (advertValue < window.constants.priceInterval.MIDDLE);
        break;
      case ('middle'):
        result = (advertValue >= window.constants.priceInterval.MIDDLE) && (advertValue < window.constants.priceInterval.HIGH);
        break;
      case ('high'):
        result = (advertValue >= window.constants.priceInterval.HIGH);
        break;
    }

    return result;
  };

  /**
   * Сравнивает свойства features в объявлении и форме-фильтр, и возвращает true, если в объявлении есть все отмеченные в форме соответствующие элементы.
   * @param {Array} advertValue
   * @param {Array} formValue
   * @return {Boolean}
   */
  var comparesFeatures = function (advertValue, formValue) {
    return formValue.every(function (formItem) {
      return advertValue.some(function (advertItem) {
        return advertItem === formItem;
      });
    });
  };

  /**
   * Функция фильтрует данные, которые пришли с сервера каждый раз, когда происходят изменения в форме.
   * @param {Object} filterFormContent
   * @return {Array}
   */
  var filterAdverts = function (filterFormContent) {
    var adverts = window.map.adverts;

    for (var key in filterFormContent) {
      if (filterFormContent[key]) {
        adverts = adverts.filter(function (advert) {
          return comparesAdvertsForm(key, advert, filterFormContent);
        });
      }
    }

    return adverts;
  };

  window.filter = filterAdverts;
})();
