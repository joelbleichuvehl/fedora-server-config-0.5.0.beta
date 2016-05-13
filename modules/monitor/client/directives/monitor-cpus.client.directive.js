(function () {
  'use strict';

  // Directive monitor-discos
  angular
    .module('monitor')
    .directive('monitorCpus', [function() {

      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'modules/monitor/client/views/monitor-cpus.template.html'
        /* controller: 'MonitorCpusController',
        controllerAs: 'monitorCpusController' */
        /* link: function(scope, element, attrs) {
        } */
      };
    }]);
}());
