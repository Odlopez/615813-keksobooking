'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var ADVERTS_QUANTYTI = 8;

  /**
   * Генерирует DOM-елемент метки объявления
   * @param {advert} adverts - объект с данными для генерации объявления
   * @return {Node}
   */
  var createPin = function (adverts) {
    var pin = window.elements.mapPin.cloneNode(true);
    var pinImage = pin.children[0];

    pin.style = 'left: ' + (adverts.location.x - PIN_WIDTH / 2) + 'px; top: ' + (adverts.location.y - PIN_HEIGHT) + 'px';
    pinImage.src = adverts.author.avatar;
    pinImage.alt = adverts.offer.title;

    return pin;
  };

  /**
   * Создает заданное количество меток на карте. Связывает созданный DOM-элемент метки с JS-массивом, описывающим данные текущего объявления
   */
  var createsSimilarAdverts = function () {
    window.elements.advertOptions.length = 0;

    for (var i = 0; i < ADVERTS_QUANTYTI; i++) {
      window.elements.advertOptions.push(window.data.getAdvert(i));
    }

    var fragment = document.createDocumentFragment();

    for (i = 0; i < ADVERTS_QUANTYTI; i++) {
      var pinItem = createPin(window.elements.advertOptions[i]);

      fragment.appendChild(pinItem);
      window.elements.advertOptions[i].element = fragment.lastChild;
    }

    for (i = window.elements.mapPins.childElementCount - 1; i > 0; i--) {
      if (window.elements.mapPins.children[i] && window.elements.mapPins.children[i].className === 'map__pin') {
        window.elements.mapPins.removeChild(window.elements.mapPins.children[i]);
      }
    }

    window.elements.mapPins.appendChild(fragment);
  };

  var pin = {
    create: createsSimilarAdverts
  };

  window.pin = pin;
})();
