'use strict';

describe('Donloads E2E Tests:', function () {
  describe('Test Donloads page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/donloads');
      expect(element.all(by.repeater('donload in donloads')).count()).toEqual(0);
    });
  });
});
