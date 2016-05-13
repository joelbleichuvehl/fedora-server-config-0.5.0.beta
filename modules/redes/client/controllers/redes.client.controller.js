(function () {
  'use strict';

  // Redes controller
  angular
    .module('redes')
    .controller('RedesController', RedesController);

  RedesController.$inject = ['$scope', '$state', 'Authentication', 'redeResolve'];

  function RedesController ($scope, $state, Authentication, rede) {
    var vm = this;

    vm.authentication = Authentication;
    vm.rede = rede;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Rede
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.rede.$remove($state.go('redes.list'));
      }
    }

    // Save Rede
    function save(isValid) {

      console.log('entrou');

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.redeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.rede._id) {
        vm.rede.$update(successCallback, errorCallback);
      } else {
        vm.rede.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('redes.edit', {
          redeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
