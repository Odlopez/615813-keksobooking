'use strict';

(function () {
  var ADVERTS_QUANTYTI = 5;
  var advertOptions = [];

  /**
   * Генерирует DOM-елемент метки объявления
   * @param {advert} adverts - объект с данными для генерации объявления
   * @return {Node}
   */
  var createPin = function (adverts) {
    var template = document.querySelector('template');
    var mapPin = template.content.querySelector('.map__pin');
    var pin = mapPin.cloneNode(true);
    var pinImage = pin.children[0];

    pin.style = 'left: ' + (adverts.location.x - window.constants.PIN_WIDTH / 2) + 'px; top: ' + (adverts.location.y - window.constants.PIN_HEIGHT) + 'px';
    pinImage.src = adverts.author.avatar;
    pinImage.alt = adverts.offer.title;

    return pin;
  };

  /**
   * Создает заданное количество меток на карте. Связывает созданный DOM-элемент метки с JS-массивом, описывающим данные текущего объявления
   * @param {Array} data
   */
  var createsSimilarAdverts = function (data) {
    var mapPins = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();

    advertOptions.length = 0;

    data.slice(0, ADVERTS_QUANTYTI).forEach(function (it) {
      advertOptions.push(it);
    });

    advertOptions.forEach(function (it) {
      var pinItem = createPin(it);

      fragment.appendChild(pinItem);
      it.element = fragment.lastChild;
    });

    Array.prototype.slice.apply(mapPins.children).forEach(function (it) {
      if (it && it.className === 'map__pin') {
        mapPins.removeChild(it);
      }
    });

    mapPins.appendChild(fragment);
  };

  window.pin = {
    create: createsSimilarAdverts,
    advertOptions: advertOptions
  };
})();
