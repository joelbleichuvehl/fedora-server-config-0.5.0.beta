'use strict';

describe('Redes E2E Tests:', function () {
  describe('Test Redes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/redes');
      expect(element.all(by.repeater('rede in redes')).count()).toEqual(0);
    });
  });
});
