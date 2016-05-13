(function () {
  'use strict';

  angular
    .module('usuarios')
    .controller('UsuariosListController', UsuariosListController);

  UsuariosListController.$inject = ['UsuariosService', 'Authentication'];

  function UsuariosListController(UsuariosService, Authentication) {
    var vm = this;

    vm.usuarios = UsuariosService.query();
    vm.authentication = Authentication;
    vm.remove = remove;

    function remove (usuario) {
      if (usuario) {
        for (var i in vm.usuarios) {
          if (vm.usuarios[i] === usuario) {
            usuario = new UsuariosService(vm.usuarios[i]);
            usuario.$remove();
            vm.usuarios.splice(i, 1);
          }
        }
      }
    }
  }
}());
