'use strict';

describe('Dispositivos E2E Tests:', function () {
  describe('Test Usuarios-Samba page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/usuarios');
      expect(element.all(by.repeater('usuario in usuarios')).count()).toEqual(0);
    });
  });
});
