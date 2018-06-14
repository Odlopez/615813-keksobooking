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
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 84;
var ESC_KEYCODE = 27;

var mainPin = document.querySelector('.map__pin--main');
var template = document.querySelector('template');
var map = document.querySelector('.map');
var filterForm = document.querySelector('.map__filters');
var userForm = document.querySelector('.ad-form');
var mapContainer = filterForm.parentElement;
var mapPin = template.content.querySelector('.map__pin');
var mapCard = template.content.querySelector('.map__card');
var mapPins = document.querySelector('.map__pins');
var userAddressInput = document.querySelector('input[name="address"]');
var advertOptions = [];

/**
 * Генерирует случайное число в пределах заданных параметров
 * @param {number} to - максимальное значение случайного числа
 * @param {number} from - минимальное значение случайного числа
 * @return {number}
 */
var getRandomNumber = function (to, from) {
  from = from || 0;

  return Math.round(Math.random() * (to - from) + from);
};

/**
 * Возвращает случайный элемент массива
 * @param {Array} arr - массив, из которого необходимо выбрать случайный элемент
 * @param {boolean} getUniqueItem - определяет, вырезать или копировать выбранный элемент из изсходного массива
 * @return {Array<any>}
 */
var getRandomElement = function (arr, getUniqueItem) {
  var elementIndex = getRandomNumber(arr.length - 1);
  var randomElement = arr[elementIndex];

  if (getUniqueItem) {
    arr.splice(elementIndex, 1);
  }

  return randomElement;
};

/**
 * Возвращает массив из заданного количества случайных элементов переданного массива.
 * @param {Array} arr - исходный массив, из которого необходимо выбрать элементы
 * @param {number} count - необязательный параметр количества элементов, которые нужно выбрать. По умолчанию равен суммарному количеству элементов.
 * @return {Array}
 */
var getRandomElements = function (arr, count) {
  arr = arr.slice(0);
  count = count || getRandomNumber(arr.length);
  var resultArray = [];

  for (var i = 0; i < count; i++) {
    resultArray.push(getRandomElement(arr, true));
  }

  return resultArray;
};

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

  var element;

  advert.author = author;
  advert.offer = offer;
  advert.location = location;
  advert.element = element;

  return advert;
};

/**
 * Генерирует DOM-елемент метки объявления
 * @param {advert} adverts - объект с данными для генерации объявления
 * @return {Node}
 */
var createPin = function (adverts) {
  var pin = mapPin.cloneNode(true);
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
  advertOptions.length = 0;

  for (var i = 0; i < ADVERTS_QUANTYTI; i++) {
    advertOptions.push(getAdvert(i));
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

/**
 * Генерирует развернутое объявление
 * @param {Array.<advert>} advertOption
 * @param {function} funcClick - функция для обработчика событий при клике на кнопку закрытия
 * @return {Node}
 */
var createExpandedAdvert = function (advertOption, funcClick) {
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

  advertButtonClose.addEventListener('click', funcClick);

  return expandedAdvert;
};

/**
 * Присваивает всем дочерним элементам заданного элемента артибут disabled
 * @param {Node} element
 */
var disablesChildren = function (element) {
  for (var i = 0; i < element.children.length; i++) {
    element.children[i].disabled = true;
  }
};

/**
 * Присваивает всем дочерним элементам заданного элемента артибут enabled
 * @param {Node} element
 */
var enablesChildren = function (element) {
  for (var i = 0; i < element.children.length; i++) {
    element.children[i].disabled = false;
  }
};

/**
 * Обработчик событий для главной метки на карте
 */
var onMainPinMouseup = function () {
  map.classList.remove('map--faded');
  userForm.classList.remove('ad-form--disabled');

  enablesChildren(filterForm);
  enablesChildren(userForm);

  userAddressInput.value = (parseInt(mainPin.style.left, 10) - MAIN_PIN_WIDTH / 2) + ', ' + (parseInt(mainPin.style.top, 10) - MAIN_PIN_HEIGHT);

  createsSimilarAdverts();
};

/**
 * Удаляет из DOM-дерева развенутое объявление
 */
var deleteEpandedAdvert = function () {
  var expandedAdvert = map.querySelector('.map__card');

  if (expandedAdvert) {
    var advertButtonClose = expandedAdvert.querySelector('.popup__close');

    advertButtonClose.removeEventListener('click', onAdvertButtonCloseClick);

    for (var i = map.children.length - 1; i > 0; i--) {
      if (map.children[i] === expandedAdvert) {
        map.removeChild(map.children[i]);
      }
    }
  }
};

/**
 * Обработчик события клика на кнопку закрытия развернутого объявления
 */
var onAdvertButtonCloseClick = function () {
  deleteEpandedAdvert();
};

/**
 * Обработчик события (для document) нажатия клавищей ESC при открытой развернутом сообщении (закрывает окно и удаляет элемент)
 * @param {Event} evt
 */
var onDocumentEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    deleteEpandedAdvert();
  }
};

/**
 * Обрабочтик события клика по метке случайного объявления на карте
 * @param {Event} evt
 */
var onPinClick = function (evt) {
  if (!(evt.target.tagName === 'BUTTON' || evt.target.tagName === 'IMG')) {
    return;
  }

  for (var i = 0; i < advertOptions.length; i++) {

    if (evt.target.closest('button') === advertOptions[i].element) {
      deleteEpandedAdvert();

      var fragment = document.createDocumentFragment();

      fragment.appendChild(createExpandedAdvert(advertOptions[i], onAdvertButtonCloseClick));
      map.insertBefore(fragment, mapContainer);

      document.addEventListener('keydown', onDocumentEscPress);
    }
  }
};

document.addEventListener('click', onPinClick);

disablesChildren(filterForm);
disablesChildren(userForm);
userAddressInput.value = (parseInt(mainPin.style.left, 10) - mainPin.offsetWidth / 2) + ', ' + (parseInt(mainPin.style.top, 10) - mainPin.offsetHeight);

mainPin.addEventListener('mouseup', onMainPinMouseup);
