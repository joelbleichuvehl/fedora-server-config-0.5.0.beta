// Grupos service used to communicate Grupos REST endpoints
(function () {
  'use strict';

  angular
    .module('grupos')
    .factory('GruposService', GruposService);

  GruposService.$inject = ['$resource'];

  function GruposService($resource) {
    return $resource('api/grupos/:grupoId', {
      grupoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
