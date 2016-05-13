(function () {
  'use strict';

  angular
    .module('firewalls')
    .controller('FirewallsListController', FirewallsListController);

  FirewallsListController.$inject = ['FirewallsService'];

  function FirewallsListController(FirewallsService) {
    var vm = this;

    vm.firewalls = FirewallsService.query();
  }
}());
