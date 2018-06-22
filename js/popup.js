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

    popup.style = 'position: fixed; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); z-index: 10; top: 0; left: 0';
    error.style = 'position: absolute; width: 50%; padding: 20px; top: 50%; left: 50%; color: rgb(255, 255, 255); font-size: 50px; font-weight: 700; text-align: center; transform: translate(-50%, -50%)';
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

  window.popup = {
    create: createSystemMessage
  };
})();
