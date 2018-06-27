'use strict';
(function () {
  var lastTimeout;

  window.debounce = function (fun) {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }

    lastTimeout = setTimeout(function () {
      fun();
    }, window.constants.DEBOUNCE_INTERVAL);
  };
})();
