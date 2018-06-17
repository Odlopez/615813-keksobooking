'use strict';

(function () {
  var MAIN_PIN_COORDINATES = [570, 375];
  var MAIN_PIN_WIDTH = 64;
  var MAIN_PIN_HEIGHT = 83;

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

    window.card.delete();

    var pins = window.elements.mapPins.querySelectorAll('.map__pin');

    for (var i = pins.length - 1; i > 0; i--) {
      if (pins[i] !== window.elements.mainPin) {
        window.elements.mapPins.removeChild(pins[i]);
      }
    }

    window.elements.map.classList.add('map--faded');
    window.elements.userForm.classList.add('ad-form--disabled');
    window.form.disables(window.elements.userForm);
  };

  var form = {
    enables: enablesChildren,
    disables: disablesChildren,
    onTypeSelectChange: onTypeSelectChange,
    onRoomsSelectChange: onRoomsSelectChange
  };

  window.form = form;

  disablesChildren(window.elements.filterForm);
  disablesChildren(window.elements.userForm);

  window.elements.userForm.addEventListener('invalid', onFormInvalid, true);
  window.elements.typeSelect.addEventListener('change', onTypeSelectChange);
  window.elements.userForm.addEventListener('input', onFormInvalid);
  window.elements.timeInSelect.addEventListener('change', onTimeSelectChange);
  window.elements.timeOutSelect.addEventListener('change', onTimeSelectChange);
  window.elements.roomsSelect.addEventListener('change', onRoomsSelectChange);
  window.elements.submit.addEventListener('click', onSubmitClick);
  window.elements.resetButton.addEventListener('click', onResetButtonClick);
})();
