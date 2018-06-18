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
   * @param {Node} input
   */
  var getMessageErrorInputTitle = function (input) {
    input.style.boxShadow = '0 0 0 5px red';

    if (input.validity.tooShort) {
      input.setCustomValidity('Сообщение должно быть не менее 30 символов');
    } else if (input.validity.tooLong) {
      input.setCustomValidity('Сообщение должно быть не более 100 символов');
    } else if (input.validity.valueMissing) {
      input.setCustomValidity('Сообщение не должно быть пустым');
    } else {
      input.setCustomValidity('');
      input.style.boxShadow = 'none';
    }
  };

  /**
   * Создает сообщение об ошибке, при некорректном заполнении поля со стоимостью жилья
   * @param {Node} input
   */
  var getMessageErrorInputPrice = function (input) {
    input.style.boxShadow = '0 0 0 5px red';

    if (input.validity.rangeUnderflow) {
      input.setCustomValidity('Стоимость должна быть не ниже ' + input.min);
    } else if (input.validity.rangeOverflow) {
      input.setCustomValidity('Стоимость должна быть не выше 1000000');
    } else if (input.validity.valueMissing) {
      input.setCustomValidity('Введите цену');
    } else {
      input.setCustomValidity('');
      input.style.boxShadow = 'none';
    }
  };

  /**
   * Создает функцию для обработчика события попытки отправить невалидную форму
   * @param {Event} evt
   */
  var onFormInvalid = function (evt) {
    window.map.disablesAddressInput();

    switch (evt.target) {
      case (titleInput):
        getMessageErrorInputTitle(evt.target);
        break;
      case (priceInput):
        getMessageErrorInputPrice(evt.target);
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
   */
  var onSubmitClick = function () {
    window.map.enablesAddressInput();
  };

  /**
   * Создает функцию обработчика событий, при очистке формы пользователя
   * @param {Event} evt
   */
  var onResetButtonClick = function (evt) {
    evt.preventDefault();

    var mainPin = document.querySelector('.map__pin--main');

    userForm.reset();
    filterForm.reset();

    mainPin.style.top = window.constants.MAIN_PIN_COORDINATES[1] + 'px';
    mainPin.style.left = window.constants.MAIN_PIN_COORDINATES[0] + 'px';
    window.map.getAddressValue(mainPin);

    capacitySelect.selectedIndex = 2;

    window.card.delete();

    var mapPins = document.querySelector('.map__pins');
    var pins = mapPins.querySelectorAll('.map__pin');

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

  userForm.addEventListener('invalid', onFormInvalid, true);
  typeSelect.addEventListener('change', onTypeSelectChange);
  userForm.addEventListener('input', onFormInvalid, true);
  timeInSelect.addEventListener('change', onTimeSelectChange);
  timeOutSelect.addEventListener('change', onTimeSelectChange);
  roomsSelect.addEventListener('change', onRoomsSelectChange);
  submit.addEventListener('click', onSubmitClick);
  resetButton.addEventListener('click', onResetButtonClick);
})();
