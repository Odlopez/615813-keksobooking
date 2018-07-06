'use strict';

(function () {
  var form = document.querySelector('.map__filters');
  var inputs = {
    type: document.querySelector('[name="housing-type"]'),
    price: document.querySelector('[name="housing-price"]'),
    rooms: document.querySelector('[name="housing-rooms"]'),
    guests: document.querySelector('[name="housing-guests"]')
  };
  var featuresFieldset = form.querySelector('.map__features');

  window.FilterForm = function () {
    var features = [];

    Array.prototype.slice.apply(featuresFieldset.children).forEach(function (it) {
      if (it.checked) {
        features.push(it.value);
      }
    });

    this.type = (inputs.type.value === 'any') ? null : inputs.type.value;
    this.price = (inputs.price.value === 'any') ? null : inputs.price.value;
    this.rooms = (inputs.rooms.value === 'any') ? null : inputs.rooms.value;
    this.guests = (inputs.guests.value === 'any') ? null : inputs.guests.value;
    this.features = features;
  };
})();
