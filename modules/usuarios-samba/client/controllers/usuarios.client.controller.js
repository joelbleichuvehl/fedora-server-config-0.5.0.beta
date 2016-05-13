(function () {
  'use strict';

  // Usuarios controller
  angular
    .module('usuarios')
    .controller('UsuariosController', UsuariosController);

  UsuariosController.$inject = ['$scope', '$state', 'Authentication', 'usuarioResolve', 'GruposService'];

  function UsuariosController ($scope, $state, Authentication, usuario, GruposService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.usuario = usuario;
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.grupos = GruposService.query();
    vm.gruposSelecionados = [];

    vm.gruposList = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) list.splice(idx, 1);
      else list.push(item);
    };

    // Save Usuario
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.usuarioForm');
        return false;
      }

      vm.usuario.grupos = vm.gruposSelecionados;

      // TODO: move create/update logic to service
      if (vm.usuario._id) {
        vm.usuario.$update(successCallback, errorCallback);
      } else {
        vm.usuario.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('usuarios.list', {
          usuarioId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
