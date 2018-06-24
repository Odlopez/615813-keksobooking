'use strict';

(function () {
  window.constants = {
    ESC_KEYCODE: 27,
    LOCATION_X_COORDINATES: [0, 1200],
    LOCATION_Y_COORDINATES: [130, 630],
    PIN_WIDTH: 50,
    PIN_HEIGHT: 70,
    MAIN_PIN_WIDTH: 64,
    MAIN_PIN_HEIGHT: 83,
    MAIN_PIN_COORDINATES: [570, 375],
    ALLOWABLE_LOAD_TIME: 2000,
    READY_STATE_UNSENT: 0,
    SUCCESS_STATUS: 200,
    REDIRECT_STATUS: 300,
    QUERY_ERROR_STATUS: 400,
    SERVER_ERROR_STATUS: 500,
    SYSTEM_MESSAGE_DATAS: {
      POPUP_STYLE: 'position: fixed; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); z-index: 10; top: 0; left: 0',
      ERROR_STYLE: 'position: absolute; width: 50%; top: 50%; left: 50%; color: rgb(255, 255, 255); font-size: 50px; font-weight: 700; text-align: center; transform: translate(-50%, -50%)'
    },
    INVALID_MESSAGE_DATAS: {
      CLASS_NAME: 'js-invalid-message',
      STYLE: 'position: absolute; padding: 7px; margin-top: 50px; background-color: rgb(255, 255, 255); font-size: 14px; font-weight: 700; border-radius: 7px; border: 2px solid gold; max-width: 30%; cursor: pointer;'
    }
  };
})();
