/* (function () {
  'use strict';

  angular
    .module('firewalls')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Firewalls',
      state: 'firewalls',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'firewalls', {
      title: 'Listar firewalls',
      state: 'firewalls.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'firewalls', {
      title: 'Criar firewall',
      state: 'firewalls.create',
      roles: ['admin']
    });
  }
})();
*/
