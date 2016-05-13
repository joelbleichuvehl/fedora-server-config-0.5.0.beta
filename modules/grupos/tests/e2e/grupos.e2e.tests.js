'use strict';

describe('Grupos E2E Tests:', function () {
  describe('Test Grupos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/grupos');
      expect(element.all(by.repeater('grupo in grupos')).count()).toEqual(0);
    });
  });
});
