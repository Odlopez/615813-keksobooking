'use strict';

(function () {
  /**
   * Генерирует развернутое объявление
   * @param {Array.<advert>} advertOption
   * @param {function} funcClick - функция для обработчика событий при клике на кнопку закрытия
   * @return {Node}
   */
  var createExpandedAdvert = function (advertOption, funcClick) {
    var template = document.querySelector('template');
    var mapCard = template.content.querySelector('.map__card');
    var expandedAdvert = mapCard.cloneNode(true);
    var advertTitle = expandedAdvert.querySelector('.popup__title');
    var advertAddress = expandedAdvert.querySelector('.popup__text--address');
    var advertPrice = expandedAdvert.querySelector('.popup__text--price');
    var advertType = expandedAdvert.querySelector('.popup__type');
    var advertCapacity = expandedAdvert.querySelector('.popup__text--capacity');
    var advertTime = expandedAdvert.querySelector('.popup__text--time');
    var advertFeatures = expandedAdvert.querySelector('.popup__features');
    var advertDescription = expandedAdvert.querySelector('.popup__description');
    var advertPhotos = expandedAdvert.querySelector('.popup__photos');
    var advertAvatar = expandedAdvert.querySelector('.popup__avatar');
    var advertButtonClose = expandedAdvert.querySelector('.popup__close');

    advertTitle.textContent = advertOption.offer.title;
    advertAddress.textContent = advertOption.offer.address;
    advertPrice.textContent = advertOption.offer.price + '₽/ночь.';

    switch (advertOption.offer.type) {
      case ('flat'):
        advertType.textContent = 'Квартира';
        break;

      case ('bungalo'):
        advertType.textContent = 'Бунгало';
        break;

      case ('house'):
        advertType.textContent = 'Дом';
        break;

      default:
        advertType.textContent = 'Дворец';
    }

    advertCapacity.textContent = returnRoomReport(advertOption.offer.rooms, advertOption.offer.guests);
    advertTime.textContent = 'Заезд после ' + advertOption.offer.checkin + ', выезд до ' + advertOption.offer.checkout;

    advertOption.offer.features.forEach(function (it) {
      advertFeatures.querySelector('.popup__feature--' + it).textContent = it;
    });

    Array.prototype.slice.apply(advertFeatures.children).forEach(function (it) {
      if (it.textContent === '') {
        advertFeatures.removeChild(it);
      }
    });

    advertDescription.textContent = advertOption.offer.description;

    advertOption.offer.photos.forEach(function (it) {
      var photo = advertPhotos.children[0].cloneNode();

      photo.src = it;

      advertPhotos.appendChild(photo);
    });

    advertPhotos.removeChild(advertPhotos.children[0]);
    advertAvatar.src = advertOption.author.avatar;

    advertButtonClose.addEventListener('click', funcClick);

    return expandedAdvert;
  };

  /**
   * Возвращает строку с информацией о комнатах и гостях с учетом правил русского языка.
   * @param {Number} rooms
   * @param {Number} guests
   * @return {String}
   */
  var returnRoomReport = function (rooms, guests) {
    var roomsEnding = '';
    var guestsEnding = 'ей';

    if (rooms >= window.constants.formBorders.FIRST[0] && rooms <= window.constants.formBorders.FIRST[1]) {
      roomsEnding = '';
    } else if (rooms % 10 === window.constants.formBorders.SECOND) {
      roomsEnding = 'а';
    } else if (rooms % 10 >= window.constants.formBorders.THIRD[0] && rooms % 10 <= window.constants.formBorders.THIRD[1]) {
      roomsEnding = 'ы';
    }

    if (guests >= window.constants.formBorders.THIRD[0] && guests <= window.constants.formBorders.FIRST[1]) {
      guestsEnding = 'ей';
    } else if (guests % 10 === window.constants.formBorders.SECOND) {
      guestsEnding = 'я';
    }

    return rooms + ' комнат' + roomsEnding + ' для ' + guests + ' гост' + guestsEnding;
  };

  /**
   * Удаляет из DOM-дерева развенутое объявление.
   */
  var deleteEpandedAdvert = function () {
    var map = document.querySelector('.map');
    var mapPins = map.querySelector('.map__pins');
    var expandedAdvert = map.querySelector('.map__card');

    if (expandedAdvert) {
      var advertButtonClose = expandedAdvert.querySelector('.popup__close');

      advertButtonClose.removeEventListener('click', window.map.onAdvertButtonCloseClick);
      document.removeEventListener('keydown', window.map.onDocumentEscPress);

      Array.prototype.slice.apply(map.children).forEach(function (it) {
        if (it === expandedAdvert) {
          map.removeChild(it);
        }
      });

      Array.prototype.slice.apply(mapPins.children).forEach(function (it) {
        it.classList.remove('map__pin--active');
      });
    }
  };

  window.card = {
    create: createExpandedAdvert,
    delete: deleteEpandedAdvert
  };
})();
