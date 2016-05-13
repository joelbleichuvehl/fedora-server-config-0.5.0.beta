/* (function () {
  'use strict';

  angular
    .module('grupos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Grupos',
      state: 'grupos',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'grupos', {
      title: 'Listar grupos',
      state: 'grupos.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'grupos', {
      title: 'Criar grupo',
      state: 'grupos.create',
      roles: ['admin']
    });
  }
})();
*/
