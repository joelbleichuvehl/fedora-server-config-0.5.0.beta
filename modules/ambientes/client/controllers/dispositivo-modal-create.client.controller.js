(function () {
  'use strict';

  // Ambientes controller
  angular
    .module('ambientes')
    .controller('DispositivoModalCreateController', DispositivoModalCreateController);

  DispositivoModalCreateController.$inject = ['$scope', 'DispositivosService', 'Notify'];

  function DispositivoModalCreateController ($scope, DispositivosService, Notify) {

    var vm = this;

    vm.dispositivo = initDispositivo();
    vm.error = null;
    vm.form = {};
    vm.save = save;

    function initDispositivo() {
      var nome = $scope.$parent.vmModal.ambiente.nome;
      var numero = $scope.$parent.vmModal.ambiente.dispositivos.length + 1;

      numero = (String(numero).length < 2) ? String('0' + numero) : String(numero);

      nome = nome + '-' + numero;

      var dispositivo = new DispositivosService();
      dispositivo.numero = numero;
      dispositivo.nome = nome;
      return dispositivo;
    }

    // Save Dispositivo
    function save(isValid, ambiente) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vmCreate.form.dispositivoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.dispositivo._id) {
        vm.dispositivo.$update(successCallback, errorCallback);
      } else {
        vm.dispositivo.$save(successCallback, errorCallback);
      }

      function successCallback(dispositivo) {
        ambiente.dispositivos = ambiente.dispositivos ? ambiente.dispositivos : [];
        ambiente.dispositivos.push(dispositivo._id);
        ambiente.$update(function (ambiente) {
          Notify.sendMsg('AtualizarAmbiente', { 'id': ambiente._id });
          $scope.$parent.vmModal.modalInstance.close();
        }, function(err) {
          console.log(err);
        });
      }

      function errorCallback(err) {
        vm.error = err.data.message;
      }
    }

  }

}());
