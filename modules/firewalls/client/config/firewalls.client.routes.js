(function () {
  'use strict';

  angular
    .module('firewalls')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('firewalls', {
        abstract: true,
        url: '/firewalls',
        template: '<ui-view/>'
      })
      .state('firewalls.list', {
        url: '',
        templateUrl: 'modules/firewalls/client/views/list-firewalls.client.view.html',
        controller: 'FirewallsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Firewalls List'
        }
      })
      .state('firewalls.create', {
        url: '/create',
        templateUrl: 'modules/firewalls/client/views/form-firewall.client.view.html',
        controller: 'FirewallsController',
        controllerAs: 'vm',
        resolve: {
          firewallResolve: newFirewall
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Firewalls Create'
        }
      })
      .state('firewalls.edit', {
        url: '/:firewallId/edit',
        templateUrl: 'modules/firewalls/client/views/form-firewall.client.view.html',
        controller: 'FirewallsController',
        controllerAs: 'vm',
        resolve: {
          firewallResolve: getFirewall
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Firewall {{ firewallResolve.name }}'
        }
      })
      .state('firewalls.view', {
        url: '/:firewallId',
        templateUrl: 'modules/firewalls/client/views/view-firewall.client.view.html',
        controller: 'FirewallsController',
        controllerAs: 'vm',
        resolve: {
          firewallResolve: getFirewall
        },
        data: {
          pageTitle: 'Firewall {{ articleResolve.name }}'
        }
      });
  }

  getFirewall.$inject = ['$stateParams', 'FirewallsService'];

  function getFirewall($stateParams, FirewallsService) {
    return FirewallsService.get({
      firewallId: $stateParams.firewallId
    }).$promise;
  }

  newFirewall.$inject = ['FirewallsService'];

  function newFirewall(FirewallsService) {
    return new FirewallsService();
  }
}());
