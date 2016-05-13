'use strict';

var os = require('os'),
  exec = require('child_process').exec,
  sprintf = require('sprintf-js').sprintf;

var monitorCpusId;

// Configuração de socket para monitoramento de desempenho
module.exports = function (io, socket) {

  var dadosCpusStart = dadosCpus();

  // gera series para o gráfico de monitoramento de processadores
  socket.on('start_monitor_cpus', function () {
    if (monitorCpusId === undefined) {
      atualizaPercentuaisCpus();
      monitorCpusId = setInterval(function() {
        atualizaPercentuaisCpus();
      }, 3000);
    }
  });

  socket.on('utilizacao_cpus', function() {
    atualizaPercentuaisCpus();
  });

  function atualizaPercentuaisCpus() {
    percentuaisUsoCpus(function(utilizacaoCpus) {
      io.emit('utilizacao_cpus', utilizacaoCpus);
    });
  }

  // limpa o intervalo de monitoramento dos processadores
  socket.on('stop_monitor_cpus', function () {
    stopMonitorCpus();
  });

  function stopMonitorCpus() {
    console.log('stop socket cpus');
    clearInterval(monitorCpusId);
    monitorCpusId = undefined;
  }

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    console.log('socket disconnect');
    stopMonitorCpus();
  });

  // Calcula e o percentual de uso das cpus retornando um array de utilizacaoCpus
  function percentuaisUsoCpus(callback) {
    var utilizacaoCpus = [];

    var dadosCpusEnd = dadosCpus();

    for (var i; i < dadosCpusEnd.length; i++) {
      var diffTotalTimes = dadosCpusEnd[i].totalTimes - dadosCpusStart[i].totalTimes;
      var diffIdle = dadosCpusEnd[i].idle - dadosCpusStart[i].idle;

      var percentagem = 100 - (100 * (diffIdle / diffTotalTimes));
      utilizacaoCpus.push({ percentagem: percentagem });
    }
    callback(utilizacaoCpus);
    dadosCpusStart = dadosCpus();
  }

  // retorna um array de dadosCpus
  function dadosCpus() {
    var cpus = os.cpus();
    var dados = [];

    for (var i; i < cpus.length; i++) {
      var totalIdle = 0,
        totalTimes = 0;
      var cpu = cpus[i];

      for (var t; t < cpu.times.length; t++) {
        totalTimes += cpu.times[t];
      }

      totalIdle += cpu.times.idle;

      dados.push({ cpu: i, idle: totalIdle, totalTimes: totalTimes });

    }

    return dados;
  }

};
