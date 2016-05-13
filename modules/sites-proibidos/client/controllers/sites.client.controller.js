(function () {
  'use strict';

  // Sites controller
  angular
    .module('sites')
    .controller('SitesController', SitesController);

  SitesController.$inject = ['$scope', '$state', 'Authentication', 'siteResolve'];

  function SitesController ($scope, $state, Authentication, site) {
    var vm = this;

    vm.authentication = Authentication;
    vm.site = site;
    vm.error = null;
    vm.form = {};
    vm.save = save;

    // Save Site
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.siteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.site._id) {
        vm.site.$update(successCallback, errorCallback);
      } else {
        vm.site.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sites.list', {
          siteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
