'use strict';

/**
 * Module dependencies
 */
var ambientesPolicy = require('../policies/ambientes.server.policy'),
  ambientes = require('../controllers/ambientes.server.controller');

module.exports = function(app) {
  // Ambientes Routes
  app.route('/api/ambientes').all(ambientesPolicy.isAllowed)
    .get(ambientes.list)
    .post(ambientes.create);

  app.route('/api/ambientes/:ambienteId').all(ambientesPolicy.isAllowed)
    .get(ambientes.read)
    .put(ambientes.update)
    .delete(ambientes.delete);

  // Finish by binding the Ambiente middleware
  app.param('ambienteId', ambientes.ambienteByID);

  // app.route('/api/dhcpd').all(ambientesPolicy.isAllowed)
  //   .post(ambientes.gerar);

};
