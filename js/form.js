'use strict';

(function () {
  var TYPE_SELECT_PRICE = {
    flat: 1000,
    house: 5000,
    palace: 10000,
    bungalo: 0
  };
  var filterForm = document.querySelector('.map__filters');
  var userForm = document.querySelector('.ad-form');
  var titleInput = userForm.querySelector('input[name="title"]');
  var priceInput = userForm.querySelector('input[name="price"]');
  var typeSelect = userForm.querySelector('select[name="type"]');
  var roomsSelect = userForm.querySelector('select[name="rooms"]');
  var capacitySelect = userForm.querySelector('select[name="capacity"]');
  var submit = userForm.querySelector('.ad-form__submit');
  var resetButton = userForm.querySelector('.ad-form__reset');
  var timeInSelect = userForm.querySelector('select[name="timein"]');
  var timeOutSelect = userForm.querySelector('select[name="timeout"]');
  var mainPin = document.querySelector('.map__pin--main');
  var success = document.querySelector('.success');
  var popupVisibilityTime = 4000;

  /**
   * Сбрасывает формы до первоначального состояния
   */
  var resetForms = function () {
    userForm.reset();
    filterForm.reset();

    window.map.getAddressValue(mainPin);

    capacitySelect.selectedIndex = 2;

    window.card.delete();
  };

  /**
   * Коллбэк для успешно отправленной формы
   */
  var onLoadForm = function () {
    resetForms();
    window.map.disablesAddressInput();

    success.classList.remove('hidden');

    setTimeout(function () {
      if (!success.classList.contains('hidden')) {
        onDocumentClick();
      }
    }, popupVisibilityTime);

    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onDocumentKeydown);
  };

  /**
   * Создает функцию для обработчика события клика по документку (закрытие сообщения об успешной отправке)
   */
  var onDocumentClick = function () {
    success.classList.add('hidden');

    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onDocumentKeydown);
  };

  /**
   * Создает функцию для обработчика события нажатия ESC при открытом сообщении об успешной отправке (закрывает его)
   * @param {Event} evt
   */
  var onDocumentKeydown = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      onDocumentClick();
    }
  };

  /**
   * Коллбэк для ошибки при отправке формы пользователя
   * @param {any} statusError
   */
  var onError = function (statusError) {
    window.map.disablesAddressInput();
    switch (Math.round(statusError / 100)) {
      case (0):
        window.popup.create('Произошла ошибка отправки данных');
        break;

      case (3):
        window.popup.create('Сервер переехал на другой адресс');
        break;

      case (4):
        if (!titleInput.validity.valid) {
          getMessageErrorInputTitle();
        }

        if (!priceInput.validity.valid) {
          getMessageErrorInputPrice();
        }

        window.popup.create('Данные заполненые неверно');
        break;

      case (5):
        window.popup.create('Произошла ошибка на сервере');
        break;

      default:
        window.popup.create('Ошибка: ' + statusError.name + ' ' + statusError.message);
    }
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
   * Создает сообщение об ошибке, при некорректном заполнении поля с заголовком объявления
   */
  var getMessageErrorInputTitle = function () {
    titleInput.style.boxShadow = '0 0 0 5px red';

    if (titleInput.validity.tooShort) {
      titleInput.setCustomValidity('Сообщение должно быть не менее 30 символов');
    } else if (titleInput.validity.tooLong) {
      titleInput.setCustomValidity('Сообщение должно быть не более 100 символов');
    } else if (titleInput.validity.valueMissing) {
      titleInput.setCustomValidity('Сообщение не должно быть пустым');
    } else {
      titleInput.setCustomValidity('');
      titleInput.style.boxShadow = 'none';
    }
  };

  /**
   * Создает сообщение об ошибке, при некорректном заполнении поля со стоимостью жилья
   */
  var getMessageErrorInputPrice = function () {
    priceInput.style.boxShadow = '0 0 0 5px red';

    if (priceInput.validity.rangeUnderflow) {
      priceInput.setCustomValidity('Стоимость должна быть не ниже ' + priceInput.min);
    } else if (priceInput.validity.rangeOverflow) {
      priceInput.setCustomValidity('Стоимость должна быть не выше 1000000');
    } else if (priceInput.validity.valueMissing) {
      priceInput.setCustomValidity('Введите цену');
    } else {
      priceInput.setCustomValidity('');
      priceInput.style.boxShadow = 'none';
    }
  };

  /**
   * Создает функцию для обработчика события изменения типа жилья.
   */
  var onTypeSelectChange = function () {
    priceInput.min = TYPE_SELECT_PRICE[typeSelect.value];
    priceInput.value = TYPE_SELECT_PRICE[typeSelect.value];
    priceInput.placeholder = TYPE_SELECT_PRICE[typeSelect.value];
    priceInput.style.boxShadow = 'none';
  };

  /**
   * Создает функцию для обработчика событий, при изменении поля со временем выезда/заезда
   * @param {Event} evt
   */
  var onTimeSelectChange = function (evt) {
    var changeInput = (evt.target === timeInSelect) ? timeOutSelect : timeInSelect;

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
    var value = (roomsSelect.value === '100') ? '0' : roomsSelect.value;

    for (var i = 0; i < capacitySelect.children.length; i++) {
      if (capacitySelect.children[i].value > value) {
        capacitySelect.children[i].style.display = 'none';
      } else {
        capacitySelect.children[i].style.display = 'initial';
      }

      if (capacitySelect.children[i].value === '0') {
        capacitySelect.children[i].style.display = (value === '0') ? 'initial' : 'none';
        capacitySelect.selectedIndex = (value === '0') ? 3 : 2;
      }
    }
  };

  /**
   * Создает функцию обработчика событий, при отправлении формы
   * @param {Event} evt
   */
  var onSubmitClick = function (evt) {
    evt.preventDefault();

    var form = evt.target.form;

    window.map.enablesAddressInput();
    window.backend.upload(new FormData(form), onLoadForm, onError);
  };

  /**
   * Создает функцию обработчика событий, при очистке формы пользователя
   * @param {Event} evt
   */
  var onResetButtonClick = function (evt) {
    evt.preventDefault();

    var mapPins = document.querySelector('.map__pins');
    var pins = mapPins.querySelectorAll('.map__pin');

    mainPin.style.top = window.constants.MAIN_PIN_COORDINATES[1] + 'px';
    mainPin.style.left = window.constants.MAIN_PIN_COORDINATES[0] + 'px';
    priceInput.style.boxShadow = 'none';
    titleInput.style.boxShadow = 'none';

    resetForms();

    for (var i = pins.length - 1; i > 0; i--) {
      if (pins[i] !== mainPin) {
        mapPins.removeChild(pins[i]);
      }
    }

    window.map.fadeMap();
    userForm.classList.add('ad-form--disabled');
    window.form.disables(userForm);
  };

  var form = {
    enables: enablesChildren,
    disables: disablesChildren,
    onTypeSelectChange: onTypeSelectChange,
    onRoomsSelectChange: onRoomsSelectChange
  };

  window.form = form;

  disablesChildren(filterForm);
  disablesChildren(userForm);

  typeSelect.addEventListener('change', onTypeSelectChange);
  timeInSelect.addEventListener('change', onTimeSelectChange);
  timeOutSelect.addEventListener('change', onTimeSelectChange);
  roomsSelect.addEventListener('change', onRoomsSelectChange);
  submit.addEventListener('click', onSubmitClick);
  resetButton.addEventListener('click', onResetButtonClick);

  titleInput.addEventListener('input', getMessageErrorInputTitle);
  priceInput.addEventListener('input', getMessageErrorInputPrice);
})();
