(function () {
  'use strict';

  angular
    .module('redes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('redes', {
        abstract: true,
        url: '/redes',
        template: '<ui-view/>'
      })
      .state('redes.list', {
        url: '',
        templateUrl: 'modules/redes/client/views/list-redes.client.view.html',
        controller: 'RedesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Redes List'
        }
      })
      .state('redes.create', {
        url: '/create',
        templateUrl: 'modules/redes/client/views/form-rede.client.view.html',
        controller: 'RedesController',
        controllerAs: 'vm',
        resolve: {
          redeResolve: newRede
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Redes Create'
        }
      })
      .state('redes.edit', {
        url: '/:redeId/edit',
        templateUrl: 'modules/redes/client/views/form-rede.client.view.html',
        controller: 'RedesController',
        controllerAs: 'vm',
        resolve: {
          redeResolve: getRede
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Rede {{ redeResolve.name }}'
        }
      })
      .state('redes.view', {
        url: '/:redeId',
        templateUrl: 'modules/redes/client/views/view-rede.client.view.html',
        controller: 'RedesController',
        controllerAs: 'vm',
        resolve: {
          redeResolve: getRede
        },
        data: {
          pageTitle: 'Rede {{ articleResolve.name }}'
        }
      });
  }

  getRede.$inject = ['$stateParams', 'RedesService'];

  function getRede($stateParams, RedesService) {
    return RedesService.get({
      redeId: $stateParams.redeId
    }).$promise;
  }

  newRede.$inject = ['RedesService'];

  function newRede(RedesService) {
    return new RedesService();
  }
}());
