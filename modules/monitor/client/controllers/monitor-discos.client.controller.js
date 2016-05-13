(function () {
  'use strict';

  angular
    .module('monitor')
    .controller('MonitorDiscosController', MonitorDiscosController);

  MonitorDiscosController.$inject = ['$interval', '$scope', '$state', 'Authentication', 'Socket', '$window'];

  function MonitorDiscosController($interval, $scope, $state, Authentication, Socket, $window) {
    var vm = this;
    var d3 = $window.d3;

    vm.piePercent1 = 75;

    vm.discos = [];

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

      Socket.emit('utilizacao_discos');
      var intervaloTempoDiscos = $interval(function () {
        Socket.emit('start_monitor_discos');
      }, 600000);

      Socket.on('utilizacao_discos', function(dadosDiscos) {
        vm.dadosDiscos = [];

        for (var i = 0; i < dadosDiscos.length; i++) {
          var disco = dadosDiscos[i];
          vm.dadosDiscos.push({ 'disco': disco, 'data': [{ key: 'Utilizado', y: disco.uso }, { key: 'Livre', y: 100 - disco.uso }] });
        }
      });

      /* $scope.$on('$destroy', function () {
        console.log('destroy');
        $interval.cancel(intervaloTempoDiscos);
        Socket.emit('stop_monitor_discos');
        Socket.removeListener('utilizacao_discos');
      }); */

    }

    vm.pieOptions1 = {
      animate: {
        duration: 700,
        enabled: true
      },
      barColor: '#a3297a',
      // trackColor: colors.byName('inverse'),
      scaleColor: false,
      lineWidth: 30,
      lineCap: 'circle'
    };

    vm.options = {
      chart: {
        type: 'pieChart',
        height: 200,
        x: function(d) {return d.key; },
        y: function(d) {return d.y; },
        showLabels: false,
        duration: 500,
        labelThreshold: 0.01,
        labelSunbeamLayout: true,
        tooltip: {
          valueFormatter: function(d) {
            return d3.format(',.2f')(d) + ' %';
          }
        },
        legend: {
          margin: {
            top: 5,
            right: 35,
            bottom: 5,
            left: 0
          }
        }
      }
    };
  }

}());
