/* (function () {
  'use strict';

  angular
    .module('logs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {

    Menus.addMenuItem('topbar', {
      title: 'Log',
      state: 'logs',
      type: 'dropdown',
      roles: ['admin', 'user']
    });
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'logs', {
      title: 'Criar log',
      state: 'logs.create',
      roles: ['admin']
    });
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'logs', {
      title: 'Listar logs',
      state: 'logs.list'
    });

    // Add the dropdown list autenticacao item
    Menus.addSubMenuItem('topbar', 'logs', {
      title: 'Listar logs de autenticação',
      state: 'logs.list-autenticacao'
    });

    // Add the dropdown list evento item
    Menus.addSubMenuItem('topbar', 'logs', {
      title: 'Listar logs de eventos',
      state: 'logs.list-eventos'
    });

    // Add the dropdown list firewall item
    Menus.addSubMenuItem('topbar', 'logs', {
      title: 'Listar logs de firewall',
      state: 'logs.list-firewall'
    });

    // Add the dropdown list mrtg item
    Menus.addSubMenuItem('topbar', 'logs', {
      title: 'Listar logs de mrtg',
      state: 'logs.list-mrtg'
    });

    // Add the dropdown list mrtg item
    Menus.addSubMenuItem('topbar', 'logs', {
      title: 'Listar logs de sarg',
      state: 'logs.list-sarg'
    });


  }
})();
*/
