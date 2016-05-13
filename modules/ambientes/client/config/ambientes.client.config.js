/* (function () {
  'use strict';

  angular
    .module('ambientes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Ambientes',
      state: 'ambientes',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'ambientes', {
      title: 'List Ambientes',
      state: 'ambientes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'ambientes', {
      title: 'Create Ambiente',
      state: 'ambientes.create',
      roles: ['admin']
    });
  }
})();
*/
