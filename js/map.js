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
var LOCATION_X_COORDINATES = [0, 1200];
var LOCATION_Y_COORDINATES = [130, 630];
var MAIN_PIN_COORDINATES = [570, 375];
var ADVERTS_QUANTYTI = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 64;
var MAIN_PIN_HEIGHT = 83;
var ESC_KEYCODE = 27;

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
    window.elements.advertOptions.push(getAdvert(i));
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

/**
 * Генерирует развернутое объявление
 * @param {Array.<advert>} advertOption
 * @param {function} funcClick - функция для обработчика событий при клике на кнопку закрытия
 * @return {Node}
 */
var createExpandedAdvert = function (advertOption, funcClick) {
  var expandedAdvert = window.elements.mapCard.cloneNode(true);
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
 * Создает функцию для обработчика события перетягивания главной метки
 * @param {Event} evt
 */
var onMainPinMousedown = function (evt) {
  evt.preventDefault();

  var shift = {
    x: evt.clientX - window.elements.mainPin.offsetLeft,
    y: evt.clientY - window.elements.mainPin.offsetTop
  };

  var onMainPinMousemove = function (evtMove) {
    evtMove.preventDefault();

    window.elements.mainPin.style.top = evtMove.clientY - shift.y + 'px';
    window.elements.mainPin.style.left = evtMove.clientX - shift.x + 'px';

    if ((evtMove.clientY - shift.y) < (LOCATION_Y_COORDINATES[0] - MAIN_PIN_HEIGHT)) {
      window.elements.mainPin.style.top = LOCATION_Y_COORDINATES[0] - MAIN_PIN_HEIGHT + 'px';
    } else if ((evtMove.clientY - shift.y) > (LOCATION_Y_COORDINATES[1] - MAIN_PIN_HEIGHT)) {
      window.elements.mainPin.style.top = LOCATION_Y_COORDINATES[1] - MAIN_PIN_HEIGHT + 'px';
    }

    if ((evtMove.clientX - shift.x) < (LOCATION_X_COORDINATES[0] - MAIN_PIN_WIDTH / 2)) {
      window.elements.mainPin.style.left = LOCATION_X_COORDINATES[0] - MAIN_PIN_WIDTH / 2 + 'px';
    } else if ((evtMove.clientX - shift.x) > (LOCATION_X_COORDINATES[1] - MAIN_PIN_WIDTH / 2)) {
      window.elements.mainPin.style.left = LOCATION_X_COORDINATES[1] - MAIN_PIN_WIDTH / 2 + 'px';
    }

    window.elements.addressInput.value = (parseInt(window.elements.mainPin.offsetLeft, 10) + MAIN_PIN_WIDTH / 2) + ', ' + (parseInt(window.elements.mainPin.offsetTop, 10) + MAIN_PIN_HEIGHT);
  };

  var onMainPinMouseup = function () {
    if (window.elements.map.classList.contains('map--faded')) {
      window.elements.map.classList.remove('map--faded');
      window.elements.userForm.classList.remove('ad-form--disabled');

      deleteEpandedAdvert();
      enablesChildren(window.elements.filterForm);
      enablesChildren(window.elements.userForm);
      onTypeSelectChange();
      onRoomsSelectChange();

      createsSimilarAdverts();
    }

    window.elements.addressInput.value = (parseInt(window.elements.mainPin.offsetLeft, 10) + MAIN_PIN_WIDTH / 2) + ', ' + (parseInt(window.elements.mainPin.offsetTop, 10) + MAIN_PIN_HEIGHT);

    document.removeEventListener('mousemove', onMainPinMousemove);
    document.removeEventListener('mouseup', onMainPinMouseup);
  };

  document.addEventListener('mousemove', onMainPinMousemove);
  document.addEventListener('mouseup', onMainPinMouseup);
};

/**
 * Удаляет из DOM-дерева развенутое объявление
 */
var deleteEpandedAdvert = function () {
  var expandedAdvert = window.elements.map.querySelector('.map__card');

  if (expandedAdvert) {
    var advertButtonClose = expandedAdvert.querySelector('.popup__close');

    advertButtonClose.removeEventListener('click', onAdvertButtonCloseClick);
    document.removeEventListener('keydown', onDocumentEscPress);

    for (var i = window.elements.map.children.length - 1; i > 0; i--) {
      if (window.elements.map.children[i] === expandedAdvert) {
        window.elements.map.removeChild(window.elements.map.children[i]);
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

  for (var i = 0; i < window.elements.advertOptions.length; i++) {

    if (evt.target.closest('button') === window.elements.advertOptions[i].element) {
      deleteEpandedAdvert();

      var fragment = document.createDocumentFragment();

      fragment.appendChild(createExpandedAdvert(window.elements.advertOptions[i], onAdvertButtonCloseClick));
      window.elements.map.insertBefore(fragment, window.elements.mapContainer);

      document.addEventListener('keydown', onDocumentEscPress);
    }
  }
};

/**
 * Создает сообщение об ошибке, при некорректном заполнении поля с заголовком объявления
 * @param {Node} input
 */
var getMessageErrorInputTitle = function (input) {
  if (input.validity.tooShort) {
    input.setCustomValidity('Сообщение должно быть не менее 30 символов');
  } else if (input.validity.tooLong) {
    input.setCustomValidity('Сообщение должно быть не более 100 символов');
  } else if (input.validity.valueMissing) {
    input.setCustomValidity('Сообщение не должно быть пустым');
  } else {
    input.setCustomValidity('');
  }
};

/**
 * Создает сообщение об ошибке, при некорректном заполнении поля со стоимостью жилья
 * @param {Node} input
 */
var getMessageErrorInputPrice = function (input) {
  if (input.validity.rangeUnderflow) {
    input.setCustomValidity('Стоимость должна быть не ниже ' + input.min);
  } else if (input.validity.rangeOverflow) {
    input.setCustomValidity('Стоимость должна быть не выше 1000000');
  } else if (input.validity.valueMissing) {
    input.setCustomValidity('Введите цену');
  } else {
    input.setCustomValidity('');
  }
};

/**
 * Создает функцию для обработчика события попытки отправить невалидную форму
 * @param {Event} evt
 */
var onFormInvalid = function (evt) {
  switch (evt.target) {
    case (window.elements.titleInput):
      getMessageErrorInputTitle(evt.target);
      break;
    case (window.elements.priceInput):
      getMessageErrorInputPrice(evt.target);
  }
};

/**
 * Создает функцию для обработчика события изменения типа жилья.
 */
var onTypeSelectChange = function () {
  switch (window.elements.typeSelect.value) {
    case ('flat'):
      window.elements.priceInput.min = 1000;
      window.elements.priceInput.value = 1000;
      window.elements.priceInput.placeholder = 1000;
      break;
    case ('house'):
      window.elements.priceInput.min = 5000;
      window.elements.priceInput.value = 5000;
      window.elements.priceInput.placeholder = 5000;
      break;
    case ('palace'):
      window.elements.priceInput.min = 10000;
      window.elements.priceInput.value = 10000;
      window.elements.priceInput.placeholder = 10000;
      break;
    default:
      window.elements.priceInput.min = 0;
      window.elements.priceInput.value = 0;
      window.elements.priceInput.placeholder = 0;
  }
};

/**
 * Создает функцию для обработчика событий, при изменении поля со временем выезда/заезда
 * @param {Event} evt
 */
var onTimeSelectChange = function (evt) {
  var changeInput = (evt.target === window.elements.timeInSelect) ? window.elements.timeOutSelect : window.elements.timeInSelect;

  for (var i = 0; i < changeInput.children.length; i++) {
    if (changeInput.children[i].value === evt.target.value) {
      changeInput.children[i].selected = 'true';
    }
  }
};

/**
 * Создает функцию обработчика событий, при изменении поля количества комнат
 */
var onRoomsSelectChange = function () {
  var value = (window.elements.roomsSelect.value === '100') ? '0' : window.elements.roomsSelect.value;
  for (var i = 0; i < window.elements.capacitySelect.children.length; i++) {
    if (window.elements.capacitySelect.children[i].value > value) {
      window.elements.capacitySelect.children[i].style.display = 'none';
    } else {
      window.elements.capacitySelect.children[i].style.display = 'initial';
    }

    if (window.elements.capacitySelect.children[i].value === '0') {
      window.elements.capacitySelect.children[i].style.display = (value === '0') ? 'initial' : 'none';
      window.elements.capacitySelect.selectedIndex = (value === '0') ? 3 : 2;
    }
  }
};

/**
 * Создает функцию обработчика событий, при отправлении формы
 */
var onSubmitClick = function () {
  window.elements.addressInput.disabled = false;
};

/**
 * Создает функцию обработчика событий, при очистке формы пользователя
 * @param {Event} evt
 */
var onResetButtonClick = function (evt) {
  evt.preventDefault();

  window.elements.userForm.reset();
  window.elements.filterForm.reset();

  window.elements.mainPin.style.top = MAIN_PIN_COORDINATES[1] + 'px';
  window.elements.mainPin.style.left = MAIN_PIN_COORDINATES[0] + 'px';
  window.elements.addressInput.value = (parseInt(window.elements.mainPin.style.left, 10) + MAIN_PIN_WIDTH / 2) + ', ' + (parseInt(window.elements.mainPin.style.top, 10) + MAIN_PIN_HEIGHT);

  window.elements.capacitySelect.selectedIndex = 2;

  deleteEpandedAdvert();

  var pins = window.elements.mapPins.querySelectorAll('.map__pin');

  for (var i = pins.length - 1; i > 0; i--) {
    if (pins[i] !== window.elements.mainPin) {
      window.elements.mapPins.removeChild(pins[i]);
    }
  }

  window.elements.map.classList.add('map--faded');
  window.elements.userForm.classList.add('ad-form--disabled');
  disablesChildren(window.elements.userForm);
};

disablesChildren(window.elements.filterForm);
disablesChildren(window.elements.userForm);

document.addEventListener('click', onPinClick);
window.elements.userForm.addEventListener('invalid', onFormInvalid, true);
window.elements.typeSelect.addEventListener('change', onTypeSelectChange);
window.elements.userForm.addEventListener('input', onFormInvalid);
window.elements.timeInSelect.addEventListener('change', onTimeSelectChange);
window.elements.timeOutSelect.addEventListener('change', onTimeSelectChange);
window.elements.roomsSelect.addEventListener('change', onRoomsSelectChange);
window.elements.submit.addEventListener('click', onSubmitClick);
window.elements.resetButton.addEventListener('click', onResetButtonClick);
window.elements.mainPin.addEventListener('mousedown', onMainPinMousedown);
