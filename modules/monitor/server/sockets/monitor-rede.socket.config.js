'use strict';

var os = require('os'),
  exec = require('child_process').exec,
  sprintf = require('sprintf-js').sprintf;

var monitorRedeId;
var dados = {};

// Configuração de socket para monitoramento de desempenho
module.exports = function (io, socket) {

  socket.on('start_monitor_rede', function () {
    if (monitorRedeId === undefined) {
      atualizaPercentuaisRede();
      monitorRedeId = setInterval(function() {
        atualizaPercentuaisRede();
      }, 3000);
    }
  });

  socket.on('utilizacao_rede', function() {
    atualizaPercentuaisRede();
  });

  function atualizaPercentuaisRede() {
    dadosRede(function(utilizacaoRede) {
      io.emit('utilizacao_rede', utilizacaoRede);
    });
  }

  // limpa o intervalo de monitoramento de memória
  socket.on('stopMonitorRede', function () {
    stopMonitorRede();
  });

  function stopMonitorRede() {
    console.log('stop socket rede');
    clearInterval(monitorRedeId);
    monitorRedeId = undefined;
  }

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    console.log('socket disconnect');
    stopMonitorRede();
  });

  function dadosRede(callback) {
    var ip = exec('ip -s link');

    ip.stdout.on('data', function (data) {
      dados.network = dados.network || {};
      dados.network.interface = {};

      var networkInterface;
      var lines = data.trim().split('\n');
      var state = 0;

      for (var i = 0; i < lines.length; i++) {
        switch (state) {
          case 0:
            networkInterface = lines[i].split(':')[1].trim();
            break;
          case 3:
            var rx = lines[i].trim().replace(/\s+/g, ' ').split(' ');
            dados.network.interface[networkInterface] = dados.network.interface[networkInterface] || {};
            dados.network.interface[networkInterface].rx = {};
            var ref = dados.network.interface[networkInterface].rx;
            ref.bytes = Number(rx[0]);
            ref.packets = Number(rx[1]);
            ref.errors = Number(rx[2]);
            ref.dropped = Number(rx[3]);
            ref.overrun = Number(rx[4]);
            ref.mcast = Number(rx[5]);
            break;
          case 5:
            var tx = lines[i].trim().replace(/\s+/g, ' ').split(' ');
            dados.network.interface[networkInterface] = dados.network.interface[networkInterface] || {};
            dados.network.interface[networkInterface].tx = {};
            ref = dados.network.interface[networkInterface].tx;
            ref.bytes = Number(tx[0]);
            ref.packets = Number(tx[1]);
            ref.errors = Number(tx[2]);
            ref.dropped = Number(tx[3]);
            ref.carrier = Number(tx[4]);
            ref.collsns = Number(tx[5]);
            break;
        }
        state = (state + 1) % 6;
      }

      callback(dados.network.interface);

    });
  }

};
