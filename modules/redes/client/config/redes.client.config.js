/* (function () {
  'use strict';

  angular
    .module('redes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Redes',
      state: 'redes',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'redes', {
      title: 'Listar redes',
      state: 'redes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'redes', {
      title: 'Criar rede',
      state: 'redes.create',
      roles: ['admin']
    });
  }
})();
*/
