'use strict';

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
var LOCATION_X_COORDINATES = [300, 900];
var LOCATION_Y_COORDINATES = [130, 630];
var ADVERTS_QUANTYTI = 8;
var template = document.querySelector('template');
var map = document.querySelector('.map');
var mapContainer = map.querySelector('.map__filters-container');
var mapPin = template.content.querySelector('.map__pin');
var mapCard = template.content.querySelector('.map__card');
var mapPins = document.querySelector('.map__pins');

var getRandomNumber = function (to, from) {
  from = from || 0;
  var randomNumber = Math.round(Math.random() * (to - from) + from);

  return randomNumber;
};

var getRandomElement = function (arr, getUniqueItem) {
  var elementIndex = getRandomNumber(arr.length - 1);
  var randomElement = arr[elementIndex];

  if (getUniqueItem) {
    arr.splice(elementIndex, 1);
  }

  return randomElement;
};

var getRandomElements = function (arr, count) {
  arr = arr.slice(0);
  count = count || getRandomNumber(arr.length);
  var resultArray = [];

  for (var i = 0; i < count; i++) {
    resultArray.push(getRandomElement(arr, true));
  }

  return resultArray;
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
  offer.features = getRandomElements(FEATURES);
  offer.description = '';
  offer.photos = getRandomElements(PHOTOS, PHOTOS.length);

  advert.author = author;
  advert.offer = offer;
  advert.location = location;

  return advert;
};

var createPin = function (adverts) {
  var pin = mapPin.cloneNode(true);
  var pinImage = pin.children[0];
  var pinWidth = +pinImage.getAttribute('height');
  var pinHeight = +pinImage.getAttribute('width');

  pin.style = 'left: ' + (adverts.location.x + pinWidth / 2) + 'px; top: ' + (adverts.location.y + pinHeight) + 'px';
  pinImage.src = adverts.author.avatar;
  pinImage.alt = adverts.offer.title;

  return pin;
};

var createExpandedAdvert = function (advertOption) {
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

    case ('palace'):
      advertType = 'Дворец';
      break;
  }

  advertCapacity.textContent = advertOption.offer.rooms + ' комнаты для ' + advertOption.offer.guests + ' гостей';
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

  return expandedAdvert;
};

var advertOptions = [];

for (var i = 0; i < ADVERTS_QUANTYTI; i++) {
  advertOptions.push(getAdvert());
}

map.classList.remove('map--faded');

var fragment = document.createDocumentFragment();

for (i = 0; i < ADVERTS_QUANTYTI; i++) {
  fragment.appendChild(createPin(advertOptions[i]));
}

mapPins.appendChild(fragment);

fragment.innerHtml = '';
fragment.appendChild(createExpandedAdvert(advertOptions[0]));

map.insertBefore(fragment, mapContainer);
