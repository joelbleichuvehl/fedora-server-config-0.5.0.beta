'use strict';

var os = require('os'),
  exec = require('child_process').exec,
  sprintf = require('sprintf-js').sprintf;

var monitorDiscosId;

// Configuração de socket para monitoramento de desempenho
module.exports = function (io, socket) {

  socket.on('start_monitor_discos', function () {
    if (monitorDiscosId === undefined) {
      atualizaPercentuaisDiscos();
      monitorDiscosId = setInterval(function() {
        atualizaPercentuaisDiscos();
      }, 300000);
    }
  });

  socket.on('utilizacao_discos', function() {
    atualizaPercentuaisDiscos();
  });

  function atualizaPercentuaisDiscos() {
    dadosDisco(function(dadosDisco) {
      io.emit('utilizacao_discos', dadosDisco);
    });
  }

  // limpa o intervalo de monitoramento de discos
  socket.on('stop_monitor_discos', function () {
    stopMonitorDiscos();
  });

  function stopMonitorDiscos() {
    console.log('stop socket discos');
    clearInterval(monitorDiscosId);
    monitorDiscosId = undefined;
  }

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    console.log('socket disconnect');
    stopMonitorDiscos();
  });

  function dadosDisco(callback) {
    var df = exec('df -T -x tmpfs -x rootfs -x devtmpfs --block-size=1');

    df.stdout.on('data', function (data) {
      var discos = [];
      var array = data.toString().split('\n');
      array.forEach(function(novaStr) {
        if (novaStr.match(/^\/dev/g)) {
          var campos = novaStr.split(' ');
          var camposLimpos = [];
          campos.forEach(function(str) {
            str = str.trim();
            if (str !== '') {
              camposLimpos.push(str);
            }
          });

          var disco = { 'montagem': camposLimpos[0].trim(),
                        'tipo': camposLimpos[1].trim(),
                        'tamanho': (Number(camposLimpos[2].trim()) / (1024 * 1024)).toFixed(2),
                        'usado': (Number(camposLimpos[3].trim()) / (1024 * 1024)).toFixed(2),
                        'disponivel': camposLimpos[4].trim(),
                        'uso': (Number(camposLimpos[3].trim()) / Number(camposLimpos[2].trim()) * 100).toFixed(2),
                        'particao': camposLimpos[6].trim()
                      };
          discos.push(disco);
        }
      });

      callback(discos);
    });

    df.stderr.on('data', function (data) {
      console.log('df stderr: ${data}');
    });

    df.on('close', function(code) {
      if (code !== 0) {
        console.log('df process exited with code ${code}');
      }
    });

  }

};
