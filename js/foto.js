'use strict';

(function () {
  var getFotoSRC = function (file, onReaderLoad) {
    var reader = new FileReader();

    reader.addEventListener('load', onReaderLoad);

    reader.readAsDataURL(file);
  };

  window.getFotoSRC = getFotoSRC;
})();
