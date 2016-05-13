(function () {
  'use strict';

  angular
    .module('logs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('logs', {
        abstract: true,
        url: '/logs',
        template: '<ui-view/>'
      })
      .state('logs.list', {
        url: '',
        templateUrl: 'modules/logs/client/views/list-logs.client.view.html',
        controller: 'LogsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Logs List'
        }
      })
      .state('logs.list-autenticacao', {
        url: '',
        templateUrl: 'modules/logs/client/views/list-logs-autenticacao.client.view.html',
        controller: 'LogsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Logs List Autenticação'
        }
      })
      .state('logs.list-eventos', {
        url: '',
        templateUrl: 'modules/logs/client/views/list-logs-eventos.client.view.html',
        controller: 'LogsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Logs List eventos'
        }
      })
      .state('logs.list-firewall', {
        url: '',
        templateUrl: 'modules/logs/client/views/list-logs-firewall.client.view.html',
        controller: 'LogsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Logs List firewall'
        }
      })
      .state('logs.list-mrtg', {
        url: '',
        templateUrl: 'modules/logs/client/views/list-logs-mrtg.client.view.html',
        controller: 'LogsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Logs List mrtg'
        }
      })
      .state('logs.list-sarg', {
        url: '',
        templateUrl: 'modules/logs/client/views/list-logs-sarg.client.view.html',
        controller: 'LogsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Logs List sarg'
        }
      })
      .state('logs.create', {
        url: '/create',
        templateUrl: 'modules/logs/client/views/form-log.client.view.html',
        controller: 'LogsController',
        controllerAs: 'vm',
        resolve: {
          logResolve: newLog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Logs Create'
        }
      })
      .state('logs.edit', {
        url: '/:logId/edit',
        templateUrl: 'modules/logs/client/views/form-log.client.view.html',
        controller: 'LogsController',
        controllerAs: 'vm',
        resolve: {
          logResolve: getLog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Log {{ logResolve.name }}'
        }
      })
      .state('logs.view', {
        url: '/:logId',
        templateUrl: 'modules/logs/client/views/view-log.client.view.html',
        controller: 'LogsController',
        controllerAs: 'vm',
        resolve: {
          logResolve: getLog
        },
        data: {
          pageTitle: 'Log {{ articleResolve.name }}'
        }
      });
  }

  getLog.$inject = ['$stateParams', 'LogsService'];

  function getLog($stateParams, LogsService) {
    return LogsService.get({
      logId: $stateParams.logId
    }).$promise;
  }

  newLog.$inject = ['LogsService'];

  function newLog(LogsService) {
    return new LogsService();
  }
}());
