'use strict';

describe('Sites Proibidos E2E Tests:', function () {
  describe('Test Sites Proibidos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sites');
      expect(element.all(by.repeater('sites in sites')).count()).toEqual(0);
    });
  });
});
