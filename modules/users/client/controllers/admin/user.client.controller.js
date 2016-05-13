(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$http', '$window', 'Authentication', 'userResolve', 'EstadosService'];

  function UserController($scope, $state, $http, $window, Authentication, user, EstadosService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = user;
    vm.remove = remove;
    vm.update = update;
    vm.estados = EstadosService.query();
    filtraCidades();
    vm.filtraCidades = filtraCidades;
    enumTipoPessoa();
    enumEstadoCivil();
    enumSexo();
    enumTipoEndereco();

    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = vm.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        vm.error = errorResponse.data.message;
      });
    }

    function filtraCidades() {
      if (vm.user.estado) {
        $http.get('/api/cidades/estado/' + vm.user.estado).success(function (cidades) {
          vm.cidades = cidades;
        }).error(function (response) {
          vm.cidades = [];
          vm.error = response.message;
        });
      } else {
        vm.cidades = [];
      }
    }

    function enumTipoPessoa() {
      $http.get('/api/users/enumTipoPessoa').success(function (enumTipoPessoa) {
        vm.enumTipoPessoa = enumTipoPessoa;
      }).error(function (response) {
        vm.enumTipoPessoa = [];
        vm.error = response.message;
      });
    }

    function enumEstadoCivil() {
      $http.get('/api/users/enumEstadoCivil').success(function (enumEstadoCivil) {
        vm.enumEstadoCivil = enumEstadoCivil;
      }).error(function (response) {
        vm.enumEstadoCivil = [];
        vm.error = response.message;
      });
    }

    function enumSexo() {
      $http.get('/api/users/enumSexo').success(function (enumSexo) {
        vm.enumSexo = enumSexo;
      }).error(function (response) {
        vm.enumSexo = [];
        vm.error = response.message;
      });
    }

    function enumTipoEndereco() {
      $http.get('/api/users/enumTipoEndereco').success(function (enumTipoEndereco) {
        vm.enumTipoEndereco = enumTipoEndereco;
      }).error(function (response) {
        vm.enumTipoEndereco = [];
        vm.error = response.message;
      });
    }

  }
}());
