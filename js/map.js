'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var addressInput = document.querySelector('input[name="address"]');
  var filterForm = document.querySelector('.map__filters');

  /**
   * Вызывает функцию создания похожих объявлений
   * @param {Array} data
   */
  var createPins = function (data) {
    window.map.adverts = data;
    window.pin.create(data);
  };

  /**
   * Выводит в консоль сообщение об ошибке
   * @param {String} message
   */
  var onLoadDataError = function (message) {
    window.popup.createSystemMessage(message, true);
  };

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

      if ((evtMove.clientY - shift.y) < (window.constants.LOCATION_Y_COORDINATES[0] - window.constants.MAIN_PIN_HEIGHT)) {
        mainPin.style.top = window.constants.LOCATION_Y_COORDINATES[0] - window.constants.MAIN_PIN_HEIGHT + 'px';
      } else if ((evtMove.clientY - shift.y) > (window.constants.LOCATION_Y_COORDINATES[1] - window.constants.MAIN_PIN_HEIGHT)) {
        mainPin.style.top = window.constants.LOCATION_Y_COORDINATES[1] - window.constants.MAIN_PIN_HEIGHT + 'px';
      }

      if ((evtMove.clientX - shift.x) < (window.constants.LOCATION_X_COORDINATES[0] - window.constants.MAIN_PIN_WIDTH / 2)) {
        mainPin.style.left = window.constants.LOCATION_X_COORDINATES[0] - window.constants.MAIN_PIN_WIDTH / 2 + 'px';
      } else if ((evtMove.clientX - shift.x) > (window.constants.LOCATION_X_COORDINATES[1] - window.constants.MAIN_PIN_WIDTH / 2)) {
        mainPin.style.left = window.constants.LOCATION_X_COORDINATES[1] - window.constants.MAIN_PIN_WIDTH / 2 + 'px';
      }

      getAddressValue(mainPin);
    };

    var onMainPinMouseup = function () {
      if (map.classList.contains('map--faded')) {
        var userForm = document.querySelector('.ad-form');

        map.classList.remove('map--faded');
        userForm.classList.remove('ad-form--disabled');

        window.card.delete();
        window.form.enables(filterForm);
        window.form.enables(userForm);
        window.form.onTypeSelectChange();
        window.form.onRoomsSelectChange();

        window.backend.load(createPins, onLoadDataError);
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
    addressInput.value = (parseInt(elem.offsetLeft, 10) + window.constants.MAIN_PIN_WIDTH / 2) + ', ' + (parseInt(elem.offsetTop, 10) + window.constants.MAIN_PIN_HEIGHT);
  };

  /**
   * Обрабочтик события клика по метке случайного объявления на карте
   * @param {Event} evt
   */
  var onPinClick = function (evt) {
    if (!(evt.target.tagName === 'BUTTON' || evt.target.tagName === 'IMG')) {
      return;
    }

    var elem = evt.target.closest('button');

    var mapContainer = document.querySelector('.map__filters-container');

    for (var i = 0; i < window.pin.advertOptions.length; i++) {
      window.pin.advertOptions[i].element.classList.remove('map__pin--active');

      if (elem === window.pin.advertOptions[i].element) {
        window.card.delete();

        var fragment = document.createDocumentFragment();

        fragment.appendChild(window.card.create(window.pin.advertOptions[i], window.map.onAdvertButtonCloseClick));
        map.insertBefore(fragment, mapContainer);

        document.addEventListener('keydown', window.map.onDocumentEscPress);
      }
    }

    if (!elem.classList.contains('map__pin--main')) {
      elem.classList.add('map__pin--active');
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
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      window.card.delete();
    }
  };

  /**
   * Обработчик события для формы-фильтра (при изменении ее параметров)
   */
  var onFilterFormInput = function () {
    window.debounce(function () {
      var filterFormContent = new window.FilterForm();
      window.card.delete();
      window.pin.create(window.filter(filterFormContent));
    });
  };

  /**
   * Скрывает карту
   */
  var fadeMap = function () {
    map.classList.add('map--faded');
  };

  document.addEventListener('click', onPinClick);
  mainPin.addEventListener('mousedown', onMainPinMousedown);
  filterForm.addEventListener('input', onFilterFormInput);

  window.map = {
    onAdvertButtonCloseClick: onAdvertButtonCloseClick,
    onDocumentEscPress: onDocumentEscPress,
    fadeMap: fadeMap,
    getAddressValue: getAddressValue,
    adverts: []
  };
})();
