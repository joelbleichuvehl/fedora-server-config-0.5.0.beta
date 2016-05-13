(function () {
  'use strict';

  angular
    .module('sites')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sites', {
        abstract: true,
        url: '/sites',
        template: '<ui-view/>'
      })
      .state('sites.list', {
        url: '',
        templateUrl: 'modules/sites-proibidos/client/views/list-sites.client.view.html',
        controller: 'SitesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sites List'
        }
      })
      .state('sites.create', {
        url: '/create',
        templateUrl: 'modules/sites-proibidos/client/views/form-site.client.view.html',
        controller: 'SitesController',
        controllerAs: 'vm',
        resolve: {
          siteResolve: newSite
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Sites Create'
        }
      })
      .state('sites.edit', {
        url: '/:siteId/edit',
        templateUrl: 'modules/sites-proibidos/client/views/form-site.client.view.html',
        controller: 'SitesController',
        controllerAs: 'vm',
        resolve: {
          siteResolve: getSite
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Site {{ siteResolve.name }}'
        }
      })
      .state('sites.view', {
        url: '/:siteId',
        templateUrl: 'modules/sites-proibidos/client/views/view-site.client.view.html',
        controller: 'SitesController',
        controllerAs: 'vm',
        resolve: {
          siteResolve: getSite
        },
        data: {
          pageTitle: 'Site {{ articleResolve.name }}'
        }
      });
  }

  getSite.$inject = ['$stateParams', 'SitesService'];

  function getSite($stateParams, SitesService) {
    return SitesService.get({
      siteId: $stateParams.siteId
    }).$promise;
  }

  newSite.$inject = ['SitesService'];

  function newSite(SitesService) {
    return new SitesService();
  }
}());
