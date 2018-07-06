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
  var addressInput = document.querySelector('input[name="address"]');
  var mainPin = document.querySelector('.map__pin--main');
  var success = document.querySelector('.success');
  var popupVisibilityTime = 4000;
  var adFormField = document.querySelector('.ad-form__field');
  var userFotoLoader = adFormField.querySelector('input[type="file"]');
  var adFormUpload = document.querySelector('.ad-form__upload');
  var flatFotoLoader = adFormUpload.querySelector('input[type="file"]');
  var adFormHeaderPreview = document.querySelector('.ad-form-header__preview');
  var userAvatar = adFormHeaderPreview.querySelector('img');
  var flatFotos = document.querySelector('.ad-form__photo');

  /**
   * Сбрасывает формы до первоначального состояния
   */
  var resetForms = function () {
    userForm.reset();
    filterForm.reset();

    userAvatar.src = window.constants.USER_FOTO_PREVIEW_SRC;
    flatFotos.innerHTML = '';

    window.map.getAddressValue(mainPin);

    capacitySelect.selectedIndex = 2;

    window.card.delete();
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
   * Коллбэк для успешно отправленной формы
   */
  var onLoadForm = function () {
    disablesAddressInput();
    resetPage();

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
   * Возвращает первую цифру статуса ответа сервера
   * @param {Number} num
   * @return {Number}
   */
  var shortensStatusNumber = function (num) {
    return Math.round(num / 100);
  };

  /**
   * Коллбэк для ошибки при отправке формы пользователя
   * @param {any} statusError
   */
  var onError = function (statusError) {
    disablesAddressInput();

    switch (shortensStatusNumber(statusError)) {
      case (window.constants.Status.READY_STATE_UNSENT):
        window.popup.createSystemMessage('Произошла ошибка отправки данных');
        break;

      case (shortensStatusNumber(window.constants.Status.REDIRECT)):
        window.popup.createSystemMessage('Сервер переехал на другой адресс');
        break;

      case (shortensStatusNumber(window.constants.Status.QUERY_ERROR)):
        if (!titleInput.validity.valid) {
          getMessageErrorInputTitle();
        }

        if (!priceInput.validity.valid) {
          getMessageErrorInputPrice();
        }

        window.popup.createSystemMessage('Данные заполненые неверно');
        break;

      case (shortensStatusNumber(window.constants.Status.SERVER_ERROR)):
        window.popup.createSystemMessage('Произошла ошибка на сервере');
        break;

      default:
        window.popup.createSystemMessage('Ошибка: ' + statusError.name + ' ' + statusError.message);
    }
  };

  /**
   * Присваивает всем дочерним элементам заданного элемента артибут disabled
   * @param {Node} element
   */
  var disablesChildren = function (element) {
    Array.prototype.slice.apply(element.children).forEach(function (it) {
      it.disabled = true;
    });
  };

  /**
   * Присваивает всем дочерним элементам заданного элемента артибут enabled
   * @param {Node} element
   */
  var enablesChildren = function (element) {
    Array.prototype.slice.apply(element.children).forEach(function (it) {
      it.disabled = false;
    });
  };

  /**
   * Сбрасывает страницу до первоначального состояния
   */
  var resetPage = function () {
    var mapPins = document.querySelector('.map__pins');
    var pins = mapPins.querySelectorAll('.map__pin');

    mainPin.style.top = window.constants.MAIN_PIN_COORDINATES[1] + 'px';
    mainPin.style.left = window.constants.MAIN_PIN_COORDINATES[0] + 'px';
    priceInput.style.boxShadow = 'none';
    titleInput.style.boxShadow = 'none';

    resetForms();

    pins.forEach(function (it) {
      if (it !== mainPin) {
        mapPins.removeChild(it);
      }
    });

    window.map.fadeMap();
    userForm.classList.add('ad-form--disabled');
    disablesChildren(filterForm);
    disablesChildren(userForm);
    cancelError(titleInput);
    cancelError(priceInput);
    window.popup.createInvalidMessage(titleInput, '');
    window.popup.createInvalidMessage(priceInput, '');
  };

  /**
   * Функция снимает ошибку с элемента
   * @param {Node} elem
   */
  var cancelError = function (elem) {
    elem.setCustomValidity('');
    elem.style.boxShadow = 'none';
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
      cancelError(titleInput);
    }

    window.popup.createInvalidMessage(titleInput, titleInput.validationMessage);
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
      cancelError(priceInput);
    }

    window.popup.createInvalidMessage(priceInput, priceInput.validationMessage);
  };

  /**
   * Создает функцию для обработчика события изменения типа жилья.
   */
  var onTypeSelectChange = function () {
    priceInput.min = TYPE_SELECT_PRICE[typeSelect.value];
    priceInput.placeholder = TYPE_SELECT_PRICE[typeSelect.value];

    getMessageErrorInputPrice();
  };

  /**
   * Создает функцию для обработчика событий, при изменении поля со временем выезда/заезда
   * @param {Event} evt
   */
  var onTimeSelectChange = function (evt) {
    var changeInput = (evt.target === timeInSelect) ? timeOutSelect : timeInSelect;

    Array.prototype.slice.apply(changeInput.children).forEach(function (it) {
      if (it.value === evt.target.value) {
        it.selected = 'true';
      }
    });
  };

  /**
   * Создает функцию обработчика событий, при изменении поля количества комнат
   */
  var onRoomsSelectChange = function () {
    var value = (roomsSelect.value === '100') ? '0' : roomsSelect.value;

    Array.prototype.slice.apply(capacitySelect.children).forEach(function (it) {
      if (it.value > value) {
        it.style.display = 'none';
      } else {
        it.style.display = 'initial';
      }

      if (it.value === '0') {
        it.style.display = (value === '0') ? 'initial' : 'none';
        capacitySelect.selectedIndex = (value === '0') ? 3 : 2;
      }
    });
  };

  /**
   * Создает функцию обработчика событий, при отправлении формы
   * @param {Event} evt
   */
  var onSubmitClick = function (evt) {
    evt.preventDefault();

    var form = evt.target.form;

    enablesAddressInput();
    window.backend.upload(new FormData(form), onLoadForm, onError);
  };

  /**
   * Создает функцию обработчика событий, при очистке формы пользователя
   * @param {Event} evt
   */
  var onResetButtonClick = function (evt) {
    evt.preventDefault();

    resetPage();
  };

  /**
   * Создает функцию обработчика событий, при загрузке пользователем аватарки
   */
  var onUserFotoLoaderChange = function () {
    /**
     * Добавляет фото пользователя, при создании им объявления, в DOM
     * @param {Event} evt
     */
    var addUserFoto = function (evt) {
      userAvatar.src = evt.currentTarget.result;
    };

    window.foto.check(userFotoLoader.files[0], addUserFoto);
  };

  /**
   * Создает функцию обработчика событий, при загрузке пользователем фотографий жилья
   */
  var onFlatFotoLoader = function () {
    var files = flatFotoLoader.files;

    /**
     * Добавляет и отрисовывает фотографии жилья, при создании пользователем объявления
     * @param {Event} evt
     */
    var addFlatFoto = function (evt) {
      var adFormPhoto = document.querySelector('.ad-form__photo');
      var foto = document.createElement('img');

      foto.src = evt.currentTarget.result;

      adFormPhoto.appendChild(foto);
    };

    Array.prototype.slice.apply(files).forEach(function (it) {
      window.foto.check(it, addFlatFoto);
    });
  };

  /**
   * Подготавливает форму, выставляя значения по умолчанию
   */
  var prepareForm = function () {
    onRoomsSelectChange();
    onTypeSelectChange();
    cancelError(titleInput);
    cancelError(priceInput);
    window.popup.createInvalidMessage(titleInput, '');
    window.popup.createInvalidMessage(priceInput, '');
  };

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
  titleInput.addEventListener('invalid', getMessageErrorInputTitle);
  priceInput.addEventListener('invalid', getMessageErrorInputPrice);
  userFotoLoader.addEventListener('change', onUserFotoLoaderChange);
  flatFotoLoader.addEventListener('change', onFlatFotoLoader);

  window.form = {
    enables: enablesChildren,
    disables: disablesChildren,
    prepareForm: prepareForm
  };
})();
