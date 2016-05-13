(function () {
  'use strict';

  angular
    .module('monitor')
    .controller('MonitorMemoriaController', MonitorMemoriaController);

  MonitorMemoriaController.$inject = ['$interval', '$scope', '$state', 'Authentication', 'Socket', '$window'];

  function MonitorMemoriaController($interval, $scope, $state, Authentication, Socket, $window) {
    var vm = this;
    var d3 = $window.d3;

    // var corMemoria = 'rgba(63, 81, 181, 0.80)';
    var corMemoria = 'rgba(92, 138, 138, 1)';

    vm.data = [{ key: 'Utilização da Memória', values: [] }];

    vm.chartObject = {};
    vm.chartObject.type = 'Gauge';
    vm.chartObject.options = {
      // width: 400,
      // height: 120,
      redFrom: 90,
      redTo: 100,
      yellowFrom: 75,
      yellowTo: 90,
      minorTicks: 5,
      vAxis: {
        format: '#k'
      }
    };

    vm.chartObject.data = [
      ['Label', 'Value'],
      ['', 0]
    ];

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

      Socket.emit('utilizacao_memoria');
      var intervaloTempoMemoria = $interval(function () {
        Socket.emit('start_monitor_memoria');
      }, 20000);

      Socket.on('utilizacao_memoria', function(utilizacaoMemoria) {
        // console.log(utilizacaoMemoria);
        if (vm.data && vm.data.length === 2 && vm.data[0].values && vm.data[0].values.length > 9) {
          vm.data[0].values.shift();
        }

        /* if(vm.data && vm.data.length === 2 && vm.data[1].values && vm.data[1].values.length > 10) {
          vm.data[1].values.shift();
        } */

        var valX = Date.now();
        var valY = utilizacaoMemoria.physical.used;

        vm.chartObject.data[1][1] = parseInt('valY', valY);
        vm.data[0].values.push({ 'x': valX, 'y': valY });
        // vm.data[1].values.push({ 'x': valX, 'y': utilizacaoMemoria.memoriaLivre / (1024 * 1024 * 1024) });
        // console.log(vm.data);
      });

      /* $scope.$on('$destroy', function () {
        $interval.cancel(intervaloTempoMemoria);
        Socket.emit('stop_monitor_memoria');
        Socket.removeListener('utilizacao_memoria');
      }); */
    }

    vm.options = {
      chart: {
        config: {
          refreshDataOnly: true,
          deepWatchData: true
        },
        type: 'lineChart',
        color: [corMemoria],
        height: 300,
        margin: {
          top: 32,
          right: 32,
          bottom: 32,
          left: 55
        },
        duration: 10,
        clipEdge: true,
        isArea: true,
        useInteractiveGuideline: true,
        clipVoronoi: false,
        interpolate: 'cardinal',
        x: function (d) {
          return d.x;
        },
        y: function (d) {
          return d.y;
        },
        yDomain: [0, 100],
        xAxis: {
          tickFormat: function (d) {
            return d3.time.format('%H:%M %Ss')(new Date(d));
          },
          showMaxMin: false
        },
        yAxis: {
          tickFormat: function (d) {
            return d3.format(',.2f')(d) + ' %';
          }
        },
        interactiveLayer: {
          tooltip: {
            gravity: 's',
            classes: 'gravity-s'
          }
        },
        legend: {
          margin: {
            top: 8,
            right: 0,
            bottom: 32,
            left: 0
          },
          rightAlign: true
        },
        showLegend: false
      }
    };
  }
}());
