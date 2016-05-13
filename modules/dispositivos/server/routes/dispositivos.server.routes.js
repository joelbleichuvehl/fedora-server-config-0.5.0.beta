'use strict';

/**
 * Module dependencies
 */
var dispositivosPolicy = require('../policies/dispositivos.server.policy'),
  dispositivos = require('../controllers/dispositivos.server.controller');

module.exports = function(app) {
  // Dispositivos Routes
  app.route('/api/dispositivos').all(dispositivosPolicy.isAllowed)
    .get(dispositivos.list)
    .post(dispositivos.create);

  app.route('/api/dispositivos/:dispositivoId').all(dispositivosPolicy.isAllowed)
    .get(dispositivos.read)
    .put(dispositivos.update)
    .delete(dispositivos.delete);

  // Finish by binding the Dispositivo middleware
  app.param('dispositivoId', dispositivos.dispositivoByID);
};
