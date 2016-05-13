// Usuarios service used to communicate Usuarios REST endpoints
(function () {
  'use strict';

  angular
    .module('usuarios')
    .factory('UsuariosService', UsuariosService);

  UsuariosService.$inject = ['$resource'];

  function UsuariosService($resource) {
    return $resource('api/usuarios/:usuarioId', {
      usuarioId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
