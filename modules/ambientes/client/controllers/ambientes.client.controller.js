(function () {
  'use strict';

  // Ambientes controller
  angular
    .module('ambientes')
    .controller('AmbientesController', AmbientesController);

  AmbientesController.$inject = ['$scope', '$state', 'Authentication', 'ambienteResolve', 'DispositivosService', '$uibModal', '$log', 'Dhcpd', '$location', '$http'];

  function AmbientesController ($scope, $state, Authentication, ambiente, DispositivosService, $uibModal, $log, Dhcpd, $location, $http) {
    var vm = this;

    vm.authentication = Authentication;
    vm.ambiente = ambiente;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.modalCreateDispositivo = modalCreateDispositivo;
    vm.modalEditDispositivo = modalEditDispositivo;
    vm.removeDispositivo = removeDispositivo;
    vm.dhcpd = Dhcpd.getMsg();
    // vm.gerarDhcpd = gerarDhcpd;

    vm.animationsEnabled = true;

    vm.toggleAnimation = function () {
      vm.animationsEnabled = !vm.animationsEnabled;
    };

    // Remove existing Ambiente
    function remove() {
      vm.ambiente.$remove($state.go('ambientes.list'));
    }

    // Save Ambiente
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ambienteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.ambiente._id) {
        vm.ambiente.$update(successCallback, errorCallback);
      } else {
        vm.ambiente.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('ambientes.list', {
          ambienteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Open a modal window to create a simple customer record
    function modalCreateDispositivo (size, ambienteEdit) {

      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        templateUrl: 'modules/ambientes/client/views/create-dispositivo.client.view.html',
        controller: function($scope, $uibModalInstance) {

          var vm = this;
          vm.modalInstance = $uibModalInstance;
          vm.ambiente = ambienteEdit;

          // vm.ok = function (isValid) {
          //   if (isValid && vm.objectValid) {
          //     $modalInstance.close();
          //   }
          // };

          vm.cancel = function () {
            modalInstance.dismiss('cancel');
          };

        },
        controllerAs: 'vmModal',
        size: size
      });

      /* modalInstance.result.then(function (selectedItem) {
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      }); */
    }

    // Open a modal window to create a simple customer record
    function modalEditDispositivo (size, selectedDispositivo) {

      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        templateUrl: 'modules/ambientes/client/views/edit-dispositivo.client.view.html',
        controller: function($scope, $uibModalInstance) {
          var vm = this;
          vm.modalInstance = $uibModalInstance;

          vm.selectedDispositivo = selectedDispositivo;

        /*  vm.ok = function (isValid) {
            if (isValid) {
              modalInstance.close(vm.selectedDispositivo);
            }
          };*/

          vm.cancel = function () {
            modalInstance.dismiss('cancel');
          };

        },
        controllerAs: 'vmModal',
        size: size
      });

      /* modalInstance.result.then(function (selectedItem) {
        // $scope.selectedDispositivo = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      }); */
    }

    /* function removeDispositivo (dispositivo) {
      if(dispositivo) {
        for(var i in vm.ambiente.dispositivos) {
          if(vm.ambiente.dispositivos[i] === dispositivo) {
            if (confirm('Sem certeza que deseja excluir o dispositivo' + dispositivo.nome + '?')) {
              dispositivo = new DispositivosService(vm.ambiente.dispositivos[i]);
              dispositivo.$remove();
              vm.ambiente.dispositivos.splice(i, 1);
            }
          }
        }
      }
    } */
    // JOEL: retirado a confirmação de remoção do dispositivo, visto que essa confirmação será feita no form com um modal
    function removeDispositivo (dispositivo) {
      if (dispositivo) {
        for (var i in vm.ambiente.dispositivos) {
          if (vm.ambiente.dispositivos[i] === dispositivo) {
            dispositivo = new DispositivosService(vm.ambiente.dispositivos[i]);
            dispositivo.$remove();
            vm.ambiente.dispositivos.splice(i, 1);
          }
        }
      }
    }

    // function gerarDhcpd() {
    //   console.log('entror');
    //   $http.post('/api/dhcpd');
    // }
  }
}());
