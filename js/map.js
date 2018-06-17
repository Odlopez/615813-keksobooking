'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var LOCATION_X_COORDINATES = [0, 1200];
  var LOCATION_Y_COORDINATES = [130, 630];
  var MAIN_PIN_WIDTH = 64;
  var MAIN_PIN_HEIGHT = 83;
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var addressInput = document.querySelector('input[name="address"]');

  /**
   * Создает функцию для обработчика события перетягивания главной метки
   * @param {Event} evt
   */
  var onMainPinMousedown = function (evt) {
    evt.preventDefault();

    var shift = {
      x: evt.clientX - mainPin.offsetLeft,
      y: evt.clientY - mainPin.offsetTop
    };

    var onMainPinMousemove = function (evtMove) {
      evtMove.preventDefault();

      mainPin.style.top = evtMove.clientY - shift.y + 'px';
      mainPin.style.left = evtMove.clientX - shift.x + 'px';

      if ((evtMove.clientY - shift.y) < (LOCATION_Y_COORDINATES[0] - MAIN_PIN_HEIGHT)) {
        mainPin.style.top = LOCATION_Y_COORDINATES[0] - MAIN_PIN_HEIGHT + 'px';
      } else if ((evtMove.clientY - shift.y) > (LOCATION_Y_COORDINATES[1] - MAIN_PIN_HEIGHT)) {
        mainPin.style.top = LOCATION_Y_COORDINATES[1] - MAIN_PIN_HEIGHT + 'px';
      }

      if ((evtMove.clientX - shift.x) < (LOCATION_X_COORDINATES[0] - MAIN_PIN_WIDTH / 2)) {
        mainPin.style.left = LOCATION_X_COORDINATES[0] - MAIN_PIN_WIDTH / 2 + 'px';
      } else if ((evtMove.clientX - shift.x) > (LOCATION_X_COORDINATES[1] - MAIN_PIN_WIDTH / 2)) {
        mainPin.style.left = LOCATION_X_COORDINATES[1] - MAIN_PIN_WIDTH / 2 + 'px';
      }

      getAddressValue(mainPin);
    };

    var onMainPinMouseup = function () {
      if (map.classList.contains('map--faded')) {
        var filterForm = document.querySelector('.map__filters');
        var userForm = document.querySelector('.ad-form');

        map.classList.remove('map--faded');
        userForm.classList.remove('ad-form--disabled');

        window.card.delete();
        window.form.enables(filterForm);
        window.form.enables(userForm);
        window.form.onTypeSelectChange();
        window.form.onRoomsSelectChange();

        window.pin.create();
      }

      getAddressValue(mainPin);

      document.removeEventListener('mousemove', onMainPinMousemove);
      document.removeEventListener('mouseup', onMainPinMouseup);
    };

    document.addEventListener('mousemove', onMainPinMousemove);
    document.addEventListener('mouseup', onMainPinMouseup);
  };

  /**
   * Записывает координаты главной метки (передаваемый аргумент) в поле "Адрес" формы создания объявления
   * @param {Node} elem
   */
  var getAddressValue = function (elem) {
    addressInput.value = (parseInt(elem.offsetLeft, 10) + MAIN_PIN_WIDTH / 2) + ', ' + (parseInt(elem.offsetTop, 10) + MAIN_PIN_HEIGHT);
  };

  /**
   * Удаляет атрибут disabled у поля "Адрес" формы создания объявления
   */
  var enablesAddressInput = function () {
    addressInput.disabled = false;
  };

  /**
   * Вставляет атрибут disabled у поля "Адрес" формы создания объявления
   */
  var disablesAddressInput = function () {
    addressInput.disabled = true;
  };

  /**
   * Обрабочтик события клика по метке случайного объявления на карте
   * @param {Event} evt
   */
  var onPinClick = function (evt) {
    if (!(evt.target.tagName === 'BUTTON' || evt.target.tagName === 'IMG')) {
      return;
    }

    var mapContainer = document.querySelector('.map__filters-container');

    for (var i = 0; i < window.pin.advertOptions.length; i++) {

      if (evt.target.closest('button') === window.pin.advertOptions[i].element) {
        window.card.delete();

        var fragment = document.createDocumentFragment();

        fragment.appendChild(window.card.create(window.pin.advertOptions[i], window.map.onAdvertButtonCloseClick));
        map.insertBefore(fragment, mapContainer);

        document.addEventListener('keydown', window.map.onDocumentEscPress);
      }
    }
  };

  /**
   * Обработчик события клика на кнопку закрытия развернутого объявления
   */
  var onAdvertButtonCloseClick = function () {
    window.card.delete();
  };

  /**
   * Обработчик события (для document) нажатия клавищей ESC при открытой развернутом сообщении (закрывает окно и удаляет элемент)
   * @param {Event} evt
   */
  var onDocumentEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.card.delete();
    }
  };

  var fadeMap = function () {
    map.classList.add('map--faded');
  };

  document.addEventListener('click', onPinClick);
  mainPin.addEventListener('mousedown', onMainPinMousedown);

  window.map = {
    onMainPinMousedown: onMainPinMousedown,
    onPinClick: onPinClick,
    onAdvertButtonCloseClick: onAdvertButtonCloseClick,
    onDocumentEscPress: onDocumentEscPress,
    fadeMap: fadeMap,
    getAddressValue: getAddressValue,
    enablesAddressInput: enablesAddressInput,
    disablesAddressInput: disablesAddressInput
  };
})();
