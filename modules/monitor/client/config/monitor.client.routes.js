(function () {
  'use strict';

  angular
    .module('monitor')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('monitor', {
        url: '/monitor',
        templateUrl: 'modules/monitor/client/views/system-monitor.client.view.html',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Monitoramento do Sistema'
        }
      })
      .state('monitor.view', {
        url: '',
        templateUrl: 'modules/monitor/client/views/system-monitor.client.view.html',
        controller: 'MonitorViewController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Monitoramento do Sistema'
        }
      });
  }

}());
