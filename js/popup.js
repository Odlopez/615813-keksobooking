'use strict';

(function () {
  /**
   * Создает попап с сообщением об ошибке
   * @param {String} message
   * @param {Boolean} isReset
   */
  var createSystemMessage = function (message, isReset) {
    var popup = document.createElement('div');
    var error = document.createElement('div');
    var popupVisibilityTime = 7000;

    /**
     * Удаляет попап
     */
    var removePopup = function () {
      if (popup.parentElement) {
        document.body.removeChild(popup);

        if (isReset) {
          var map = document.querySelector('.map');
          var mainPin = document.querySelector('.map__pin--main');

          map.classList.add('map--faded');
          mainPin.style.top = window.constants.MAIN_PIN_COORDINATES[1] + 'px';
          mainPin.style.left = window.constants.MAIN_PIN_COORDINATES[0] + 'px';
          window.map.getAddressValue(mainPin);
        }
      }
    };

    /**
     * Создает функцию для обработчика события клика по документку (закрытие попапа)
     */
    var onDocumentClick = function () {
      removePopup();

      document.removeEventListener('keydown', onDocumentKeydown);
      document.removeEventListener('click', onDocumentClick);
    };

    /**
     * Создает функцию для обработчика события нажатия ESC при открытом попапе (закрывает его)
     * @param {Event} evt
     */
    var onDocumentKeydown = function (evt) {
      if (evt.keyCode === window.constants.ESC_KEYCODE) {
        onDocumentClick();
      }
    };

    popup.className = window.constants.MESSAGE_CLASS_NAMES.ERROR;
    error.textContent = message;

    popup.appendChild(error);
    document.body.insertAdjacentElement('afterbegin', popup);

    setTimeout(function () {
      removePopup();

      document.removeEventListener('keydown', onDocumentKeydown);
      document.removeEventListener('click', onDocumentClick);
    }, popupVisibilityTime);

    document.addEventListener('keydown', onDocumentKeydown);
    document.addEventListener('click', onDocumentClick);
  };

  var createInvalidMessage = function (element, text) {
    var message = document.createElement('span');

    /**
     * Удаляет сообщение об ошибке
     */
    var removeInvalidMessage = function () {
      var oldInvalidMessage = element.parentElement.querySelector('.' + window.constants.MESSAGE_CLASS_NAMES.INVALID);

      if (oldInvalidMessage) {
        element.parentElement.removeChild(oldInvalidMessage);
      }
    };

    /**
     * Создает функцию для обработчика события клика по документку (закрытие сообщения об ошике)
     */
    var onMessageClick = function () {
      removeInvalidMessage();

      message.removeEventListener('click', onMessageClick);
    };

    removeInvalidMessage();

    message.className = window.constants.MESSAGE_CLASS_NAMES.INVALID;

    if (text) {
      message.textContent = text;
      element.insertAdjacentElement('beforebegin', message);
    }

    message.addEventListener('click', onMessageClick);
  };

  window.popup = {
    createSystemMessage: createSystemMessage,
    createInvalidMessage: createInvalidMessage
  };
})();
