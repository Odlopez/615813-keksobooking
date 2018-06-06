'use strict';

var AVATAR_LINKS = [
  'img/avatars/user03.png',
  'img/avatars/user02.png',
  'img/avatars/user07.png',
  'img/avatars/user05.png',
  'img/avatars/user04.png',
  'img/avatars/user08.png',
  'img/avatars/user06.png',
  'img/avatars/user01.png'
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
var LOCATION_X_COORDINATES = [300, 900];
var LOCATION_Y_COORDINATES = [130, 630];
var adverts = [];

var getRandomNumber = function (to, from) {
  from = from || 0;
  var randomNumber = Math.round(Math.random() * (to - from) + from);

  return randomNumber;
};

var getRandomElement = function (arr, bool) {
  var elementIndex = getRandomNumber(arr.length - 1);

  if (bool) {
    arr.splice(elementIndex, 1);
  }

  return arr[elementIndex];
};

var getAdvert = function () {
  var advert = {};

  var author = {};
  author.avatar = getRandomElement(AVATAR_LINKS, true);

  var location = {};
  location.x = getRandomNumber(LOCATION_X_COORDINATES[1], LOCATION_X_COORDINATES[0]);
  location.y = getRandomNumber(LOCATION_Y_COORDINATES[1], LOCATION_Y_COORDINATES[0]);

  var offer = {};
  offer.title = getRandomElement(TITLES, true);
  offer.address = location.x + ', ' + location.y;
  offer.price = getRandomNumber(1000000, 1000);
  offer.type = getRandomElement(TYPES);
  offer.rooms = getRandomNumber(ROOMS_QUANTYTI[1], ROOMS_QUANTYTI[0]);
  offer.guests = getRandomNumber(MAX_GUESTS_QUANTYTI);
  offer.checkin = getRandomElement(CHECK_TIMES);
  offer.checkout = getRandomElement(CHECK_TIMES);
  offer.features = getRandomElement(FEATURES);
  offer.description = '';
  offer.photos = getRandomElement(PHOTOS, true);

  advert.author = author;
  advert.offer = offer;
  advert.location = location;

  return advert;
};

