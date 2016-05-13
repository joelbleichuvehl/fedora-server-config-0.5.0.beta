// Redes service used to communicate Redes REST endpoints
(function () {
  'use strict';

  angular
    .module('redes')
    .factory('RedesService', RedesService);

  RedesService.$inject = ['$resource'];

  function RedesService($resource) {
    return $resource('api/redes/:redeId', {
      redeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
