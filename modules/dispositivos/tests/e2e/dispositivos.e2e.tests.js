'use strict';

describe('Dispositivos E2E Tests:', function () {
  describe('Test Dispositivos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/dispositivos');
      expect(element.all(by.repeater('dispositivo in dispositivos')).count()).toEqual(0);
    });
  });
});
