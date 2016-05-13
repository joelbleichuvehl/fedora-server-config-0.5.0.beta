// Ambientes service used to communicate Ambientes REST endpoints
(function () {
  'use strict';

  var ambientesApp = angular.module('ambientes');

  ambientesApp.factory('AmbientesService', AmbientesService);

  AmbientesService.$inject = ['$resource'];

  function AmbientesService($resource) {
    return $resource('api/ambientes/:ambienteId', {
      ambienteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  ambientesApp.factory('DhcpdService', DhcpdService);

  DhcpdService.$inject = ['$location'];

  function DhcpdService($location) {
    // $location.path('/api/dhcpd');
  }

  ambientesApp.factory('Notify', Notify);

  Notify.$inject = ['$rootScope'];

  function Notify($rootScope) {

    var notify = {};

    notify.sendMsg = function(msg, data) {
      // console.log(data);
      data = data || {};
      $rootScope.$emit(msg, data);

      // console.log('message sent!');
    };

    notify.getMsg = function(msg, func, scope) {
      var unbind = $rootScope.$on(msg, func);

      if (scope) {
        scope.$on('destroy', unbind);
      }
    };

    return notify;

  }

}());
