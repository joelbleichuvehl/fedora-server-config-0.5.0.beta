(function () {
  'use strict';

  // Dispositivos controller
  angular
    .module('dispositivos')
    .controller('DispositivosController', DispositivosController);

  DispositivosController.$inject = ['$scope', '$state', 'Authentication', 'dispositivoResolve'];

  function DispositivosController ($scope, $state, Authentication, dispositivo) {
    var vm = this;

    vm.authentication = Authentication;
    vm.dispositivo = dispositivo;
    vm.error = null;
    vm.form = {};
    // vm.remove = remove;
    vm.save = save;

    // Remove existing Dispositivo
    /* function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.dispositivo.$remove($state.go('dispositivos.list'));
      }
    } */

    // Save Dispositivo
    function save(isValid) {

      console.log('entrou');

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.dispositivoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.dispositivo._id) {
        vm.dispositivo.$update(successCallback, errorCallback);
      } else {
        vm.dispositivo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('dispositivos.list', {
          dispositivoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
