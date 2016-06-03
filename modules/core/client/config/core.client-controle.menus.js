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
      title: 'Controle',
      state: 'controle',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // TOP BAR SUBMENU ITEM
    // ambientes
    menuService.addSubMenuItem('topbar', 'controle', {
      title: 'Ambientes',
      state: 'ambientes.list'
    });

    // dispositivos
    // menuService.addSubMenuItem('topbar', 'controle', {
    //   title: 'Dispositivos',
    //   state: 'dispositivos.list'
    // });

    // downloads
    // menuService.addSubMenuItem('topbar', 'controle', {
    //   title: 'Downloads',
    //   state: 'downloads.list'
    // });

    // firewal
    // menuService.addSubMenuItem('topbar', 'controle', {
    //   title: 'Firewalls',
    //   state: 'firewalls.list'
    // });

    // grupos
    // menuService.addSubMenuItem('topbar', 'controle', {
    //   title: 'Grupos',
    //   state: 'grupos.list'
    // });

    // monitor
    // menuService.addSubMenuItem('topbar', 'controle', {
    //   title: 'Monitor',
    //   state: 'monitor.view'
    // });

    // redes
    // menuService.addSubMenuItem('topbar', 'controle', {
    //   title: 'Redes',
    //   state: 'redes.list'
    // });

    // sites proibidos
    menuService.addSubMenuItem('topbar', 'controle', {
      title: 'Sites',
      state: 'sites.list'
    });

    // usuarios samba
    // menuService.addSubMenuItem('topbar', 'controle', {
    //   title: 'Usuários samba',
    //   state: 'usuarios.list'
    // });
  }
}());
