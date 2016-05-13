(function () {
  'use strict';

  // Directive monitor-discos
  angular
    .module('monitor')
    .directive('monitorRede', [function() {

      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'modules/monitor/client/views/monitor-rede.template.html',
        controller: 'MonitorRedeController',
        controllerAs: 'monitorRedeController'
        /* link: function(scope, element, attrs) {

        } */
      };
    }]);

}());
