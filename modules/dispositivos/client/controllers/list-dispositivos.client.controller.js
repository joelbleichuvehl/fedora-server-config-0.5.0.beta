(function () {
  'use strict';

  angular
    .module('dispositivos')
    .controller('DispositivosListController', DispositivosListController);

  DispositivosListController.$inject = ['DispositivosService', 'Authentication'];

  function DispositivosListController(DispositivosService, Authentication) {
    var vm = this;

    vm.dispositivos = DispositivosService.query();
    vm.authentication = Authentication;
    vm.remove = remove;

    function remove (dispositivo) {
      if (dispositivo) {
        for (var i in vm.dispositivos) {
          if (vm.dispositivos[i] === dispositivo) {
            dispositivo = new DispositivosService(vm.dispositivos[i]);
            dispositivo.$remove();
            vm.dispositivos.splice(i, 1);
          }
        }
      }
    }
  }
}());
