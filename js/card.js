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
        advertType = 'Дом';
        break;

      default:
        advertType = 'Дворец';
    }

    advertCapacity.textContent = returnRoomReport(advertOption.offer.rooms, advertOption.offer.guests);
    advertTime.textContent = 'Заезд после ' + advertOption.offer.checkin + ', выезд до ' + advertOption.offer.checkout;

    for (var i = 0; i < advertOption.offer.features.length; i++) {
      advertFeatures.querySelector('.popup__feature--' + advertOption.offer.features[i]).textContent = advertOption.offer.features[i];
    }

    for (i = 0; i < advertFeatures.children.length; i++) {
      if (advertFeatures.children[i].textContent === '') {
        advertFeatures.removeChild(advertFeatures.children[i]);
      }
    }

    advertDescription.textContent = advertOption.offer.description;

    for (i = 0; i < advertOption.offer.photos.length; i++) {
      var photo = advertPhotos.children[0].cloneNode();

      photo.src = advertOption.offer.photos[i];

      advertPhotos.appendChild(photo);
    }

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

    if (rooms > 4 && rooms < 21) {
      roomsEnding = '';
    } else if (rooms % 10 === 1) {
      roomsEnding = 'а';
    } else if (rooms % 10 < 5 && rooms % 10 > 1) {
      roomsEnding = 'ы';
    }

    if (guests > 2 && guests < 21) {
      guestsEnding = 'ей';
    } else if (guests % 10 === 1) {
      guestsEnding = 'я';
    }

    return rooms + ' комнат' + roomsEnding + ' для ' + guests + ' гост' + guestsEnding;
  };

  /**
   * Удаляет из DOM-дерева развенутое объявление
   */
  var deleteEpandedAdvert = function () {
    var map = document.querySelector('.map');
    var mapPins = map.querySelector('.map__pins');
    var expandedAdvert = map.querySelector('.map__card');

    if (expandedAdvert) {
      var advertButtonClose = expandedAdvert.querySelector('.popup__close');

      advertButtonClose.removeEventListener('click', window.map.onAdvertButtonCloseClick);
      document.removeEventListener('keydown', window.map.onDocumentEscPress);

      for (var i = map.children.length - 1; i > 0; i--) {
        if (map.children[i] === expandedAdvert) {
          map.removeChild(map.children[i]);
        }
      }

      for (i = 0; i < mapPins.children.length; i++) {
        mapPins.children[i].classList.remove('map__pin--active');
      }
    }
  };

  window.card = {
    create: createExpandedAdvert,
    delete: deleteEpandedAdvert
  };
})();
