(function () {
  'use strict';

  angular
    .module('ambientes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ambientes', {
        abstract: true,
        url: '/ambientes',
        template: '<ui-view/>'
      })
      .state('ambientes.list', {
        url: '',
        templateUrl: 'modules/ambientes/client/views/list-ambientes.client.view.html',
        controller: 'AmbientesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Ambientes List'
        }
      })
      .state('ambientes.create', {
        url: '/create',
        templateUrl: 'modules/ambientes/client/views/form-ambiente.client.view.html',
        controller: 'AmbientesController',
        controllerAs: 'vm',
        resolve: {
          ambienteResolve: newAmbiente
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Ambientes Create'
        }
      })
      .state('ambientes.edit', {
        url: '/:ambienteId/edit',
        templateUrl: 'modules/ambientes/client/views/form-ambiente.client.view.html',
        controller: 'AmbientesController',
        controllerAs: 'vm',
        resolve: {
          ambienteResolve: getAmbiente
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Ambiente {{ ambienteResolve.name }}'
        }
      })
      .state('ambientes.view', {
        url: '/:ambienteId',
        templateUrl: 'modules/ambientes/client/views/view-ambiente.client.view.html',
        controller: 'AmbientesController',
        controllerAs: 'vm',
        resolve: {
          ambienteResolve: getAmbiente
        },
        data: {
          pageTitle: 'Ambiente {{ articleResolve.name }}'
        }
      });
  }

  getAmbiente.$inject = ['$stateParams', 'AmbientesService'];

  function getAmbiente($stateParams, AmbientesService) {
    return AmbientesService.get({
      ambienteId: $stateParams.ambienteId
    }).$promise;
  }

  newAmbiente.$inject = ['AmbientesService'];

  function newAmbiente(AmbientesService) {
    return new AmbientesService();
  }
}());
