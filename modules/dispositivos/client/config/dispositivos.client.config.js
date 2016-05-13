/* (function () {
  'use strict';

  angular
    .module('dispositivos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Dispositivos',
      state: 'dispositivos',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'dispositivos', {
      title: 'List Dispositivos',
      state: 'dispositivos.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'dispositivos', {
      title: 'Create Dispositivo',
      state: 'dispositivos.create',
      roles: ['admin']
    });
  }
})();
*/
