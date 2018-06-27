'use strict';

(function () {
  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    var URL = 'https://js.dump.academy/keksobooking/data';

    xhr.open('GET', URL);
    xhr.send();
    xhr.responseType = 'json';
    xhr.timeout = window.constants.ALLOWABLE_LOAD_TIME;

    xhr.addEventListener('load', function (evt) {
      var target = evt.target;

      try {
        if (target.status === window.constants.Status.SUCCESS) {
          onLoad(target.response);
        } else {
          onError('Статус ответа: ' + target.status + ' ' + target.statusText);
        }
      } catch (err) {
        onError(err.name + ': ' + err.message);
      }
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполнитья, за ' + xhr.timeout + 'ms');
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
  };

  var upload = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    var URL = 'https://js.dump.academy/keksobooking';

    xhr.responseType = 'json';
    xhr.timeout = window.constants.ALLOWABLE_LOAD_TIME;

    xhr.open('POST', URL);

    xhr.send(data);

    xhr.addEventListener('load', function (evt) {
      var target = evt.target;
      try {
        if (target.status === window.constants.Status.SUCCESS) {
          onLoad();
        } else {
          onError(evt.target.status);
        }
      } catch (err) {
        onError(err);
      }
    });

    xhr.addEventListener('timeout', function (evt) {
      onError(evt.target.status);
    });

    xhr.addEventListener('error', function (evt) {
      onError(evt.target.status);
    });
  };

  window.backend = {
    load: load,
    upload: upload
  };
})();

