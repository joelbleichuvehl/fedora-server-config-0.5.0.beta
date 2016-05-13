// Dispositivos service used to communicate Dispositivos REST endpoints
(function () {
  'use strict';

  angular
    .module('dispositivos')
    .factory('DispositivosService', DispositivosService);

  DispositivosService.$inject = ['$resource'];

  function DispositivosService($resource) {
    return $resource('api/dispositivos/:dispositivoId', {
      dispositivoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
