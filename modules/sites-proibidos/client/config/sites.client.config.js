/* (function () {
  'use strict';

  angular
    .module('sites')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Sites',
      state: 'sites',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'sites', {
      title: 'Listar sites',
      state: 'sites.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'sites', {
      title: 'Criar site',
      state: 'sites.create',
      roles: ['admin', 'user']
    });
  }
})();
*/
