'use strict';

(function () {
  /**
   * Сравнивает параметры введенные в форму-фильтр  и переданные в похожие объявления с сервера
   * @param {any} key
   * @param {any} advert
   * @param {Object} FilterFormContent
   * @return {Boolean}
   */
  var comparesAdvertsForm = function (key, advert, FilterFormContent) {
    var result;

    switch (key) {
      case ('type'):
        result = (advert.offer[key] === FilterFormContent[key]) || false;
        break;
      case ('rooms'):
        result = (advert.offer[key] === +FilterFormContent[key]) || false;
        break;
      case ('guests'):
        result = (advert.offer[key] === +FilterFormContent[key]) || false;
        break;
      case ('price'):
        result = comparesPrices(advert.offer[key], FilterFormContent[key]);
        break;
      case ('features'):
        result = comparesFeatures(advert.offer[key], FilterFormContent[key]);
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
        result = advertValue < 10000;
        break;
      case ('middle'):
        result = (advertValue >= 10000) && (advertValue < 50000);
        break;
      case ('high'):
        result = advertValue >= 50000;
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
   * @param {Object} FilterFormContent
   * @return {Array}
   */
  var filterAdverts = function (FilterFormContent) {
    var adverts = window.map.adverts;

    for (var key in FilterFormContent) {
      if (FilterFormContent[key]) {
        adverts = adverts.filter(function (advert) {
          return comparesAdvertsForm(key, advert, FilterFormContent);
        });
      }
    }

    return adverts;
  };

  window.filter = filterAdverts;
})();
