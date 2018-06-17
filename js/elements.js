'use strict';

(function () {
  var elements = {
    mainPin: document.querySelector('.map__pin--main'),
    template: document.querySelector('template'),
    map: document.querySelector('.map'),
    filterForm: document.querySelector('.map__filters'),
    userForm: document.querySelector('.ad-form'),
    mapPins: document.querySelector('.map__pins'),
    addressInput: document.querySelector('input[name="address"]'),
    get mapContainer() {
      return this.filterForm.parentElement;
    },
    get mapPin() {
      return this.template.content.querySelector('.map__pin');
    },
    get mapCard() {
      return this.template.content.querySelector('.map__card');
    },
    get titleInput() {
      return this.userForm.querySelector('input[name="title"]');
    },
    get priceInput() {
      return this.userForm.querySelector('input[name="price"]');
    },
    get typeSelect() {
      return this.userForm.querySelector('select[name="type"]');
    },
    get timeInSelect() {
      return this.userForm.querySelector('select[name="timein"]');
    },
    get timeOutSelect() {
      return this.userForm.querySelector('select[name="timeout"]');
    },
    get roomsSelect() {
      return this.userForm.querySelector('select[name="rooms"]');
    },
    get capacitySelect() {
      return this.userForm.querySelector('select[name="capacity"]');
    },
    get submit() {
      return this.userForm.querySelector('.ad-form__submit');
    },
    get resetButton() {
      return this.userForm.querySelector('.ad-form__reset');
    },
    advertOptions: []
  };

  window.elements = elements;
})();
