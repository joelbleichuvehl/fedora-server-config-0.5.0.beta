(function () {
  'use strict';

  angular
    .module('dispositivos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('dispositivos', {
        abstract: true,
        url: '/dispositivos',
        template: '<ui-view/>'
      })
      .state('dispositivos.list', {
        url: '',
        templateUrl: 'modules/dispositivos/client/views/list-dispositivos.client.view.html',
        controller: 'DispositivosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Dispositivos List'
        }
      })
      .state('dispositivos.create', {
        url: '/create',
        templateUrl: 'modules/dispositivos/client/views/form-dispositivo.client.view.html',
        controller: 'DispositivosController',
        controllerAs: 'vm',
        resolve: {
          dispositivoResolve: newDispositivo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Dispositivos Create'
        }
      })
      .state('dispositivos.edit', {
        url: '/:dispositivoId/edit',
        templateUrl: 'modules/dispositivos/client/views/form-dispositivo.client.view.html',
        controller: 'DispositivosController',
        controllerAs: 'vm',
        resolve: {
          dispositivoResolve: getDispositivo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Dispositivo {{ dispositivoResolve.name }}'
        }
      })
      .state('dispositivos.view', {
        url: '/:dispositivoId',
        templateUrl: 'modules/dispositivos/client/views/view-dispositivo.client.view.html',
        controller: 'DispositivosController',
        controllerAs: 'vm',
        resolve: {
          dispositivoResolve: getDispositivo
        },
        data: {
          pageTitle: 'Dispositivo {{ articleResolve.name }}'
        }
      });
  }

  getDispositivo.$inject = ['$stateParams', 'DispositivosService'];

  function getDispositivo($stateParams, DispositivosService) {
    return DispositivosService.get({
      dispositivoId: $stateParams.dispositivoId
    }).$promise;
  }

  newDispositivo.$inject = ['DispositivosService'];

  function newDispositivo(DispositivosService) {
    return new DispositivosService();
  }
}());
