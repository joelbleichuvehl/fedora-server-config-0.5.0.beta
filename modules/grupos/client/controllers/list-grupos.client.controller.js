(function () {
  'use strict';

  angular
    .module('grupos')
    .controller('GruposListController', GruposListController);

  GruposListController.$inject = ['GruposService', 'Authentication'];

  function GruposListController(GruposService, Authentication) {
    var vm = this;

    vm.grupos = GruposService.query();
    vm.authentication = Authentication;
  }
}());
