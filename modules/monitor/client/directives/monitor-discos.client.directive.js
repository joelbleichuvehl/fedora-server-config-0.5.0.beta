(function () {
  'use strict';

  // Directive monitor-discos
  angular
    .module('monitor')
    .directive('monitorDiscos', [function() {

      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'modules/monitor/client/views/monitor-discos.template.html',
        controller: 'MonitorDiscosController',
        controllerAs: 'monitorDiscosController'
        /* link: function(scope, element, attrs) {
        } */
      };
    }]);

}());
