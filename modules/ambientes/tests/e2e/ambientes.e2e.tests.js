'use strict';

describe('Ambientes E2E Tests:', function () {
  describe('Test Ambientes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ambientes');
      expect(element.all(by.repeater('ambiente in ambientes')).count()).toEqual(0);
    });
  });
});
