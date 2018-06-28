'use strict';

(function () {
  window.FilterForm = function () {
    var form = document.querySelector('.map__filters');
    var Input = {
      type: document.querySelector('[name="housing-type"]'),
      price: document.querySelector('[name="housing-price"]'),
      rooms: document.querySelector('[name="housing-rooms"]'),
      guests: document.querySelector('[name="housing-guests"]')
    };
    var featuresFieldset = form.querySelector('.map__features');
    var features = [];

    for (var i = 0; i < featuresFieldset.children.length; i++) {
      if (featuresFieldset.children[i].checked) {
        features.push(featuresFieldset.children[i].value);
      }
    }

    this.type = (Input.type.value === 'any') ? null : Input.type.value;
    this.price = (Input.price.value === 'any') ? null : Input.price.value;
    this.rooms = (Input.rooms.value === 'any') ? null : Input.rooms.value;
    this.guests = (Input.guests.value === 'any') ? null : Input.guests.value;
    this.features = features;
  };
})();
