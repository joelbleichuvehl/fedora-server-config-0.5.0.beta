(function () {
  'use strict';

  // Grupos controller
  angular
    .module('grupos')
    .controller('GruposController', GruposController);

  GruposController.$inject = ['$scope', '$state', 'Authentication', 'grupoResolve'];

  function GruposController ($scope, $state, Authentication, grupo) {
    var vm = this;

    vm.authentication = Authentication;
    vm.grupo = grupo;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Grupo
    function remove() {
      vm.grupo.$remove($state.go('grupos.list'));
    }

    // Save Grupo
    function save(isValid) {

      console.log('entrou');

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.grupoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.grupo._id) {
        vm.grupo.$update(successCallback, errorCallback);
      } else {
        vm.grupo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('grupos.view', {
          grupoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
