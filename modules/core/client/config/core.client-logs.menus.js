(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenu('account', {
      roles: ['admin', 'user']
    });

    menuService.addMenuItem('topbar', {
      title: 'Logs',
      state: 'logs',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // TOP BAR SUBMENU ITEM
    menuService.addSubMenuItem('topbar', 'logs', {
      title: 'Listar logs',
      state: 'logs.list'
    });

    // autenticacao
    menuService.addSubMenuItem('topbar', 'logs', {
      title: 'Autenticação',
      state: 'logs.list-autenticacao'
    });

    // eventos
    menuService.addSubMenuItem('topbar', 'logs', {
      title: 'Eventos',
      state: 'logs.list-eventos'
    });

    // firewall
    menuService.addSubMenuItem('topbar', 'logs', {
      title: 'Firewall',
      state: 'logs.list-firewall'
    });

    // mrtg
    menuService.addSubMenuItem('topbar', 'logs', {
      title: 'Mrtg',
      state: 'logs.list-mrtg'
    });

    // sarg
    menuService.addSubMenuItem('topbar', 'logs', {
      title: 'Sarg',
      state: 'logs.list-sarg'
    });
  }
}());
