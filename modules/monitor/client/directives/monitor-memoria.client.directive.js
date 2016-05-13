(function () {
  'use strict';

  // Directive monitor-discos
  angular
    .module('monitor')
    .directive('monitorMemoria', [function() {

      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'modules/monitor/client/views/monitor-memoria.template.html',
        controller: 'MonitorMemoriaController',
        controllerAs: 'monitorMemoriaController'
        /* link: function(scope, element, attrs) {

        } */
      };
    }]);

}());
