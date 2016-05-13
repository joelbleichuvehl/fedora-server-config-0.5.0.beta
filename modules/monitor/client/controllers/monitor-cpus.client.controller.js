(function () {
  'use strict';

  angular
    .module('monitor')
    .controller('MonitorCpusController', MonitorCpusController);

  MonitorCpusController.$inject = ['$interval', '$scope', '$state', 'Authentication', 'Socket', '$window'];

  function MonitorCpusController($interval, $scope, $state, Authentication, Socket, $window) {
    var vm = this;
    var d3 = $window.d3;

    vm.series = [];
    vm.data1 = [{ key: 'Uso dos processadores', values: [] }];
    vm.data2 = [];

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

      Socket.emit('utilizacao_cpus');
      var intervaloTempoCpu = $interval(function () {
        Socket.emit('start_monitor_cpus');
      }, 10000);

      // Add an event listener to the 'chatMessage' event
      Socket.on('utilizacao_cpus', function(utilizacaoCpus) {
        for (var i; i < utilizacaoCpus.length; i++) {
          var uso = utilizacaoCpus[i];

          if (vm.series && vm.series[i] && vm.series[i].values && vm.series[i].values.length > 9) {
            vm.series[i].values.shift();
          } else if (vm.series && vm.series[i] === undefined) {
            vm.series.push({ 'key': 'CPU-' + i, 'values': [] });
          }
          vm.series[i].values.push({ 'x': Date.now(), 'y': uso.percentagem });

          if (vm.data1[0].values[i]) {
            vm.data1[0].values.splice(i, 1, { 'label': 'CPU-' + i, 'value': uso.percentagem });
          } else {
            vm.data1[0].values.push({ 'label': 'CPU-' + i, 'value': uso.percentagem });
          }

          if (vm.data2 && vm.data2[i] && vm.data2[i].values && vm.data2[i].values.length > 0) {
            vm.data2[i].values.shift();
          } else if (vm.data2 && vm.data2[i] === undefined) {
            vm.data2.push({ 'key': 'CPU-' + i, 'values': [] });
          }
          vm.data2[i].values.push({ 'label': 'CPU-' + i, 'value': uso.percentagem });
        }
      });

      /* Socket.on('utilizacao_discos', function(dadosDisco) {
        console.log(dadosDisco);
      });*/

      // Remove the event listener when the controller instance is destroyed
      /* $scope.$on('$destroy', function () {
        // console.log('destroy socket cpus');
        Socket.emit('stop_monitor_cpus');
        $interval.cancel(intervaloTempoCpu);
        Socket.removeListener('utilizacao_cpus');
      }); */
    }

    vm.options = {
      chart: {
        config: {
          refreshDataOnly: true,
          deepWatchData: true
        },
        type: 'lineChart',
        // color: ['rgba(0, 0, 0, 0.10)', 'rgba(255, 87, 34, 0.50)', 'rgba(63, 81, 181, 0.50)'],
        height: 300,
        margin: {
          top: 32,
          right: 32,
          bottom: 32,
          left: 55
        },
        noData: 'Capturando dados da CPU...',
        duration: 250,
        clipEdge: true,
        isArea: false,
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
            // return d + ' s';
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
          rightAlign: false
        },
        showLegend: false
      }
    };

    vm.data = vm.series;

    vm.options1 = {
      chart: {
        config: {
          refreshDataOnly: true,
          deepWatchData: true
        },
        type: 'discreteBarChart',
        height: 250,
        margin: {
          top: 20,
          right: 20,
          bottom: 50,
          left: 20
        },
        x: function(d) {
          return d.label;
        },
        y: function(d) {
          return d3.format(',.2f')(d.value);
        },
        showYAxis: false,
        showValues: true,
        valueFormat: function(d) {
          return d3.format(',.1f')(d) + '%';
        },
        duration: 500,
        useInteractiveGuideline: true,
        // yDomain: [0, 100],
        yAxis: {
          tickFormat: function (d) {
            return d + ' %';
          }
        },
        showLegend: false,
        showControls: false
      }
    };

    vm.options2 = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 150,
        // color:(['#003300']),
        barColor: d3.scale.category20().range(),
        x: function(d) {return d.label;},
        y: function(d) {return d.value;},
        showValues: true,
        duration: 500,
        xAxis: {
          showMaxMin: false
        },
        yAxis: {
          axisLabel: 'Processadores',
          tickFormat: function(d) {
              // return d3.format(',.0f')(d);
          }
        },
        showGrid: false,
        showLegend: false,
        showControls: false
      }
    };
  }
}());
