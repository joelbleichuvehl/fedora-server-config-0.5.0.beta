(function () {
  'use strict';

  angular
    .module('monitor')
    .controller('MonitorRedeController', MonitorRedeController);

  MonitorRedeController.$inject = ['$interval', '$scope', '$state', 'Authentication', 'Socket', '$window'];

  function MonitorRedeController($interval, $scope, $state, Authentication, Socket, $window) {
    var vm = this;
    var d3 = $window.d3;

    init();

    function init() {

      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
      }

      Socket.emit('utilizacao_rede');
      var intervaloTempoRede = $interval(function () {
        Socket.emit('start_monitor_rede');
      }, 20000);

      Socket.on('utilizacao_rede', function(utilizacaoRede) {

        // console.log(utilizacaoRede);
        vm.teste = utilizacaoRede;

      });

      /* $scope.$on('$destroy', function () {
        $interval.cancel(intervaloTempoRede);
        Socket.emit('stop_monitor_rede');
        Socket.removeListener('utilizacao_rede');
      }); */
    }
  }
}());
