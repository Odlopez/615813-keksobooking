'use strict';

(function () {
  /**
   * Выполняет переданную функцию при загрузке заданного файла
   * @param {File} file
   * @param {Function} onReaderLoad
   */
  var getFotoSRC = function (file, onReaderLoad) {
    var reader = new FileReader();

    reader.addEventListener('load', onReaderLoad);

    reader.readAsDataURL(file);
  };

  /**
   * Выполняет переданную функцию, если загружаемый файл - картинка
   * @param {File} file
   * @param {Function} func
   */
  var makePhotoCheck = function (file, func) {
    var fileName = file.name.toLowerCase();

    var matches = window.constants.IMAGE_FILE_TYPES.some(function (elem) {
      return fileName.endsWith(elem);
    });

    if (matches) {
      getFotoSRC(file, func);
    } else {
      window.popup.createSystemMessage('Вы загрузили не фотографию');
    }
  };

  window.foto = {
    check: makePhotoCheck
  };
})();
