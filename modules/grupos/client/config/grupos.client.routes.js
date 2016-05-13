(function () {
  'use strict';

  angular
    .module('grupos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('grupos', {
        abstract: true,
        url: '/grupos',
        template: '<ui-view/>'
      })
      .state('grupos.list', {
        url: '',
        templateUrl: 'modules/grupos/client/views/list-grupos.client.view.html',
        controller: 'GruposListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Grupos List'
        }
      })
      .state('grupos.create', {
        url: '/create',
        templateUrl: 'modules/grupos/client/views/form-grupo.client.view.html',
        controller: 'GruposController',
        controllerAs: 'vm',
        resolve: {
          grupoResolve: newGrupo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Grupos Create'
        }
      })
      .state('grupos.edit', {
        url: '/:grupoId/edit',
        templateUrl: 'modules/grupos/client/views/form-grupo.client.view.html',
        controller: 'GruposController',
        controllerAs: 'vm',
        resolve: {
          grupoResolve: getGrupo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Grupo {{ grupoResolve.name }}'
        }
      })
      .state('grupos.view', {
        url: '/:grupoId',
        templateUrl: 'modules/grupos/client/views/view-grupo.client.view.html',
        controller: 'GruposController',
        controllerAs: 'vm',
        resolve: {
          grupoResolve: getGrupo
        },
        data: {
          pageTitle: 'Grupo {{ articleResolve.name }}'
        }
      });
  }

  getGrupo.$inject = ['$stateParams', 'GruposService'];

  function getGrupo($stateParams, GruposService) {
    return GruposService.get({
      grupoId: $stateParams.grupoId
    }).$promise;
  }

  newGrupo.$inject = ['GruposService'];

  function newGrupo(GruposService) {
    return new GruposService();
  }
}());
