'use strict';

var os = require('os'),
  exec = require('child_process').exec,
  sprintf = require('sprintf-js').sprintf;

var monitorMemoriaId;

// Configuração de socket para monitoramento de desempenho
module.exports = function (io, socket) {

  socket.on('start_monitor_memoria', function () {
    if (monitorMemoriaId === undefined) {
      atualizaPercentuaisMemoria();
      monitorMemoriaId = setInterval(function() {
        atualizaPercentuaisMemoria();
      }, 10000);
    }
  });

  socket.on('utilizacao_memoria', function() {
    atualizaPercentuaisMemoria();
  });

  function atualizaPercentuaisMemoria() {
    dadosMemoria(function(utilizacaoMemoria) {
      io.emit('utilizacao_memoria', utilizacaoMemoria);
    });
  }

  // limpa o intervalo de monitoramento de memória
  socket.on('stop_monitor_memoria', function () {
    stopMonitorMemoria();
  });

  function stopMonitorMemoria() {
    console.log('stop socket memória');
    clearInterval(monitorMemoriaId);
    monitorMemoriaId = undefined;
  }

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    console.log('socket disconnect');
    stopMonitorMemoria();
  });

  function dadosMemoria(callback) {
    var free = exec('free -m');

    free.stdout.on('data', function (data) {
      var dados = {};
      dados.memory = {};
      var lines = data.split('\n');

      // 2nd line
      var tokens = lines[1].split(/\s+/);
      dados.memory.physical = {};
      dados.memory.physical.total = Number(tokens[1]);
      dados.memory.physical.used = Number(tokens[2]);
      dados.memory.physical.free = Number(tokens[3]);
      dados.memory.physical.shared = Number(tokens[4]);
      dados.memory.physical.buffers = Number(tokens[5]);
      dados.memory.physical.cached = Number(tokens[6]);

      // 3th line
      tokens = lines[2].split(/\s+/);
      dados.memory.swap = {};
      dados.memory.swap.total = Number(tokens[1]);
      dados.memory.swap.used = Number(tokens[2]);
      dados.memory.swap.free = Number(tokens[3]);

      var resume = { physical: { used: {} }, swap: { used: {} } };
      resume.physical.used = (dados.memory.physical.used / dados.memory.physical.total * 100).toFixed(2);
      resume.swap.used = (dados.memory.swap.used / dados.memory.swap.total * 100).toFixed(2);


      callback(resume);
    });
    // var memoriaTotal = os.totalmem();
    // var memoriaLivre = os.freemem();
    //
    // callback({ 'memoriaTotal': memoriaTotal, 'memoriaLivre': memoriaLivre });
  }

};
