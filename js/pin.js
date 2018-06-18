'use strict';

(function () {
  var ADVERTS_QUANTYTI = 8;
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
   */
  var createsSimilarAdverts = function () {
    advertOptions.length = 0;

    var mapPins = document.querySelector('.map__pins');

    for (var i = 0; i < ADVERTS_QUANTYTI; i++) {
      advertOptions.push(window.data.getAdvert(i));
    }

    var fragment = document.createDocumentFragment();

    for (i = 0; i < ADVERTS_QUANTYTI; i++) {
      var pinItem = createPin(advertOptions[i]);

      fragment.appendChild(pinItem);
      advertOptions[i].element = fragment.lastChild;
    }

    for (i = mapPins.childElementCount - 1; i > 0; i--) {
      if (mapPins.children[i] && mapPins.children[i].className === 'map__pin') {
        mapPins.removeChild(mapPins.children[i]);
      }
    }

    mapPins.appendChild(fragment);
  };

  var pin = {
    create: createsSimilarAdverts,
    advertOptions: advertOptions
  };

  window.pin = pin;
})();
