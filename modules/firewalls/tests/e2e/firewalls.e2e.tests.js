'use strict';

describe('Firewalls E2E Tests:', function () {
  describe('Test Firewalls page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/firewalls');
      expect(element.all(by.repeater('firewall in firewalls')).count()).toEqual(0);
    });
  });
});
