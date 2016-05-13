// Firewalls service used to communicate Firewalls REST endpoints
(function () {
  'use strict';

  angular
    .module('firewalls')
    .factory('FirewallsService', FirewallsService);

  FirewallsService.$inject = ['$resource'];

  function FirewallsService($resource) {
    return $resource('api/firewalls/:firewallId', {
      firewallId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
