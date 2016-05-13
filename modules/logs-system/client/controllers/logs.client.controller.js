(function () {
  'use strict';

  // Logs controller
  angular
    .module('logs')
    .controller('LogsController', LogsController);

  LogsController.$inject = ['$scope', '$state', 'Authentication', 'logResolve'];

  function LogsController ($scope, $state, Authentication, log) {
    var vm = this;

    vm.authentication = Authentication;
    vm.log = log;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Log
    function remove() {
      if (confirm('Tem certeza de que deseja excluir?')) {
        vm.log.$remove($state.go('logs.list'));
      }
    }

    // Save Log
    function save(isValid) {

      console.log('entrou');

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.logForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.log._id) {
        vm.log.$update(successCallback, errorCallback);
      } else {
        vm.log.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('logs.list', {
          logId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
