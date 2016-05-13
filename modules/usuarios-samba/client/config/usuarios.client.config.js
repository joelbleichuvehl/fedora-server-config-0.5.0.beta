/* (function () {
  'use strict';

  angular
    .module('usuarios')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Usuários',
      state: 'usuarios',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'usuarios', {
      title: 'Listar usuários',
      state: 'usuarios.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'usuarios', {
      title: 'Criar usuário',
      state: 'usuarios.create',
      roles: ['admin']
    });
  }
})();
*/
