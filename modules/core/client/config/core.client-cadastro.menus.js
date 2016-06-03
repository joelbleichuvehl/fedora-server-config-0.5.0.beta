// (function () {
//   'use strict';
//
//   angular
//     .module('core')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['menuService'];
//
//   function menuConfig(menuService) {
//     menuService.addMenu('account', {
//       roles: ['admin']
//     });
//
//     menuService.addMenuItem('topbar', {
//       title: 'Cadastrar',
//       state: 'cadastro',
//       type: 'dropdown',
//       roles: ['admin']
//     });
//
//     // TOP BAR SUBMENU ITEM
//     // ambiente
//     menuService.addSubMenuItem('topbar', 'cadastro', {
//       title: 'Ambiente',
//       state: 'ambientes.create',
//       roles: ['admin']
//     });
//
//     // dispositivo
//     menuService.addSubMenuItem('topbar', 'cadastro', {
//       title: 'Dispositivo',
//       state: 'dispositivos.create',
//       roles: ['admin']
//     });
//
//     // dowload
//     menuService.addSubMenuItem('topbar', 'cadastro', {
//       title: 'Download',
//       state: 'downloads.create',
//       roles: ['admin']
//     });
//
//     // firewal
//     menuService.addSubMenuItem('topbar', 'cadastro', {
//       title: 'Firewall',
//       state: 'firewalls.create',
//       roles: ['admin']
//     });
//
//     // grupo
//     menuService.addSubMenuItem('topbar', 'cadastro', {
//       title: 'Grupo',
//       state: 'grupos.create',
//       roles: ['admin']
//     });
//
//     // log
//     menuService.addSubMenuItem('topbar', 'cadastro', {
//       title: 'Log',
//       state: 'logs.create',
//       roles: ['admin']
//     });
//
//     // rede
//     menuService.addSubMenuItem('topbar', 'cadastro', {
//       title: 'Rede',
//       state: 'redes.create',
//       roles: ['admin']
//     });
//
//     // site proibido
//     menuService.addSubMenuItem('topbar', 'cadastro', {
//       title: 'Proibir site',
//       state: 'sites.create',
//       roles: ['admin']
//     });
//
//     // usuario samba
//     menuService.addSubMenuItem('topbar', 'cadastro', {
//       title: 'Usuário samba',
//       state: 'usuarios.create',
//       roles: ['admin']
//     });
//   }
// }());
