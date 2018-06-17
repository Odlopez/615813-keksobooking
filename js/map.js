'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var LOCATION_X_COORDINATES = [0, 1200];
  var LOCATION_Y_COORDINATES = [130, 630];
  var MAIN_PIN_WIDTH = 64;
  var MAIN_PIN_HEIGHT = 83;

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

        window.card.delete();
        window.form.enables(window.elements.filterForm);
        window.form.enables(window.elements.userForm);
        window.form.onTypeSelectChange();
        window.form.onRoomsSelectChange();

        window.pin.create();
      }

      window.elements.addressInput.value = (parseInt(window.elements.mainPin.offsetLeft, 10) + MAIN_PIN_WIDTH / 2) + ', ' + (parseInt(window.elements.mainPin.offsetTop, 10) + MAIN_PIN_HEIGHT);

      document.removeEventListener('mousemove', onMainPinMousemove);
      document.removeEventListener('mouseup', onMainPinMouseup);
    };

    document.addEventListener('mousemove', onMainPinMousemove);
    document.addEventListener('mouseup', onMainPinMouseup);
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
        window.card.delete();

        var fragment = document.createDocumentFragment();

        fragment.appendChild(window.card.create(window.elements.advertOptions[i], window.map.onAdvertButtonCloseClick));
        window.elements.map.insertBefore(fragment, window.elements.mapContainer);

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

  var map = {
    onMainPinMousedown: onMainPinMousedown,
    onPinClick: onPinClick,
    onAdvertButtonCloseClick: onAdvertButtonCloseClick,
    onDocumentEscPress: onDocumentEscPress
  };

  window.map = map;

  document.addEventListener('click', onPinClick);
  window.elements.mainPin.addEventListener('mousedown', window.map.onMainPinMousedown);
})();
