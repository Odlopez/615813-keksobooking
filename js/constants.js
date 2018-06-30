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
    Status: {
      READY_STATE_UNSENT: 0,
      SUCCESS: 200,
      REDIRECT: 300,
      QUERY_ERROR: 400,
      SERVER_ERROR: 500
    },
    messageClassNames: {
      INVALID: 'js-invalid-message',
      ERROR: 'js-error-message',
    },
    DEBOUNCE_INTERVAL: 500,
    formBorders: {
      FIRST: [5, 20],
      SECOND: 1,
      THIRD: [2, 4]
    },
    priceIntervals: {
      MIDDLE: 10000,
      HIGH: 50000
    }
  };
})();
