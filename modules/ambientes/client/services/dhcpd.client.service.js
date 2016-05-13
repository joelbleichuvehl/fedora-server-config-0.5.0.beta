'use strict';

angular.module('ambientes')

.factory('Dhcpd', ['AmbientesService', function (AmbientesService) {

  var dhcpd = {};

  dhcpd.getMsg = function(message) {
    return message;
  };

  return dhcpd;
}]);
