(function () {
  'use strict';

  angular
    .module('usuarios')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('usuarios', {
        abstract: true,
        url: '/usuarios',
        template: '<ui-view/>'
      })
      .state('usuarios.list', {
        url: '',
        templateUrl: 'modules/usuarios-samba/client/views/list-usuarios.client.view.html',
        controller: 'UsuariosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Usuarios List'
        }
      })
      .state('usuarios.create', {
        url: '/create',
        templateUrl: 'modules/usuarios-samba/client/views/form-usuario.client.view.html',
        controller: 'UsuariosController',
        controllerAs: 'vm',
        resolve: {
          usuarioResolve: newUsuario
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Usuarios Create'
        }
      })
      .state('usuarios.edit', {
        url: '/:usuarioId/edit',
        templateUrl: 'modules/usuarios-samba/client/views/form-usuario.client.view.html',
        controller: 'UsuariosController',
        controllerAs: 'vm',
        resolve: {
          usuarioResolve: getUsuario
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Usuario {{ usuarioResolve.name }}'
        }
      })
      .state('usuarios.view', {
        url: '/:usuarioId',
        templateUrl: 'modules/usuarios-samba/client/views/view-usuario.client.view.html',
        controller: 'UsuariosController',
        controllerAs: 'vm',
        resolve: {
          usuarioResolve: getUsuario
        },
        data: {
          pageTitle: 'Usuario {{ articleResolve.name }}'
        }
      });
  }

  getUsuario.$inject = ['$stateParams', 'UsuariosService'];

  function getUsuario($stateParams, UsuariosService) {
    return UsuariosService.get({
      usuarioId: $stateParams.usuarioId
    }).$promise;
  }

  newUsuario.$inject = ['UsuariosService'];

  function newUsuario(UsuariosService) {
    return new UsuariosService();
  }
}());
