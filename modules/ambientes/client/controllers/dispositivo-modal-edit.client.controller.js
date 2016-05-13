(function () {
  'use strict';

  // Ambientes controller
  angular
    .module('ambientes')
    .controller('DispositivoModalEditController', DispositivoModalEditController);

  DispositivoModalEditController.$inject = ['$scope', 'DispositivosService', 'Notify'];

  function DispositivoModalEditController ($scope, DispositivosService, Notify) {

    var vm = this;

    /* pega o dispositivo passado por parametro para modalEditDispositivo */
    vm.dispositivo = new DispositivosService($scope.$parent.vmModal.selectedDispositivo);
    vm.error = null;
    vm.form = {};
    vm.save = save;

    // Save Dispositivo
    function save(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.dispositivoForm');
        return false;
      }

      vm.dispositivo.$update(successCallback, errorCallback);

      function successCallback(dispositivo) {
        Notify.sendMsg('AtualizarDispositivo', { 'id': dispositivo._id });
        $scope.$parent.vmModal.modalInstance.close();
      }

      function errorCallback(err) {
        vm.error = err.data.message;
      }
    }

  }

}());
