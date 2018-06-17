'use strict';

(function () {
  var AVATAR_LINKS = [
    'img/avatars/user01.png',
    'img/avatars/user02.png',
    'img/avatars/user03.png',
    'img/avatars/user04.png',
    'img/avatars/user05.png',
    'img/avatars/user06.png',
    'img/avatars/user07.png',
    'img/avatars/user08.png'
  ];
  var TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECK_TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var ROOMS_QUANTYTI = [1, 5];
  var MAX_GUESTS_QUANTYTI = 100;
  var LOCATION_X_COORDINATES = [0, 1200];
  var LOCATION_Y_COORDINATES = [130, 630];

  /**
   * Генерирует объект данных для создания объявления
   * @param {number} num - порядковый номер элемента массива данных
   * @return {advert}
   */
  var getAdvert = function (num) {
    var advert = {};

    var author = {};
    author.avatar = AVATAR_LINKS[num];

    var location = {};
    location.x = window.random.number(LOCATION_X_COORDINATES[1], LOCATION_X_COORDINATES[0]);
    location.y = window.random.number(LOCATION_Y_COORDINATES[1], LOCATION_Y_COORDINATES[0]);

    var offer = {};
    offer.title = window.random.element(TITLES, true);
    offer.address = location.x + ', ' + location.y;
    offer.price = window.random.number(1000000, 1000);
    offer.type = window.random.element(TYPES);
    offer.rooms = window.random.number(ROOMS_QUANTYTI[1], ROOMS_QUANTYTI[0]);
    offer.guests = window.random.number(MAX_GUESTS_QUANTYTI);
    offer.checkin = window.random.element(CHECK_TIMES);
    offer.checkout = window.random.element(CHECK_TIMES);
    offer.features = window.random.elements(FEATURES);
    offer.description = '';
    offer.photos = window.random.elements(PHOTOS, PHOTOS.length);

    var element;

    advert.author = author;
    advert.offer = offer;
    advert.location = location;
    advert.element = element;

    return advert;
  };

  var data = {
    getAdvert: getAdvert
  };

  window.data = data;
})();
