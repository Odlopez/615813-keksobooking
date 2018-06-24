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
    MESSAGE_CLASS_NAMES: {
      INVALID: 'js-invalid-message',
      ERROR: 'js-error-message',
    }
  };
})();
