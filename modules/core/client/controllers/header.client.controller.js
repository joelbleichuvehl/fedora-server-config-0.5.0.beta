(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', '$location', 'Authentication', 'menuService'];

  function HeaderController($scope, $state, $location, Authentication, menuService) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // indidica se o usuário logado é admin
      if (vm.authentication && vm.authentication.user) {
        vm.authentication.user.isAdmin = vm.authentication.user.roles.indexOf('admin') !== -1;
      }

      /* JOEL: testa se tem usuario, se tem vai para home ou outra url desejada pelo usuario
      se nao tem usuario logado direciona para a tela de login */
      if (vm.authentication.user) {
      // entra no sistema
      } else {
        $location.path('/authentication/signin');
      }
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }
  }
}());
