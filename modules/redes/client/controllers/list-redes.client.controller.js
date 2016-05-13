(function () {
  'use strict';

  angular
    .module('redes')
    .controller('RedesListController', RedesListController);

  RedesListController.$inject = ['RedesService', 'Authentication'];

  function RedesListController(RedesService, Authentication) {
    var vm = this;

    vm.redes = RedesService.query();
    vm.authentication = Authentication;
  }
}());
