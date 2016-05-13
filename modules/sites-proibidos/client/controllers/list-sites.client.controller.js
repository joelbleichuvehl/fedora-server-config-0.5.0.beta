(function () {
  'use strict';

  angular
    .module('sites')
    .controller('SitesListController', SitesListController);

  SitesListController.$inject = ['SitesService', 'Authentication'];

  function SitesListController(SitesService, Authentication) {
    var vm = this;

    vm.sites = SitesService.query();
    vm.authentication = Authentication;
    vm.remove = remove;

    function remove (site) {
      if (site) {
        for (var i in vm.sites) {
          if (vm.sites[i] === site) {
            site = new SitesService(vm.sites[i]);
            site.$remove();
            vm.sites.splice(i, 1);
          }
        }
      }
    }
  }
}());
