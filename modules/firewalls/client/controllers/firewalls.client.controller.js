(function () {
  'use strict';

  // Firewalls controller
  angular
    .module('firewalls')
    .controller('FirewallsController', FirewallsController);

  FirewallsController.$inject = ['$scope', '$state', 'Authentication', 'firewallResolve'];

  function FirewallsController ($scope, $state, Authentication, firewall) {
    var vm = this;

    vm.authentication = Authentication;
    vm.firewall = firewall;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Firewall
    function remove() {
      if (confirm('Tem certeza de que deseja excluir?')) {
        vm.firewall.$remove($state.go('firewalls.list'));
      }
    }

    // Save Firewall
    function save(isValid) {

      console.log('entrou');

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.firewallForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.firewall._id) {
        vm.firewall.$update(successCallback, errorCallback);
      } else {
        vm.firewall.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('firewalls.list', {
          firewallId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
