(function () {
  'use strict';

  angular
    .module('ambientes')
    .controller('AmbientesListController', AmbientesListController);

  AmbientesListController.$inject = ['AmbientesService', 'Authentication'];

  function AmbientesListController(AmbientesService, Authentication) {
    var vm = this;

    vm.ambientes = AmbientesService.query();
    vm.authentication = Authentication;
  }
}());
