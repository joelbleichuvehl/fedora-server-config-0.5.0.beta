/* (function () {
  'use strict';

  angular
    .module('downloads')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Downloads',
      state: 'downloads',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'downloads', {
      title: 'Listar downloads',
      state: 'downloads.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'downloads', {
      title: 'Criar download',
      state: 'downloads.create',
      roles: ['admin']
    });
  }
})();
*/
