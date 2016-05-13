'use strict';

/**
 * Module dependencies
 */
var redesPolicy = require('../policies/redes.server.policy'),
  redes = require('../controllers/redes.server.controller');

module.exports = function(app) {
  // Redes Routes
  app.route('/api/redes').all(redesPolicy.isAllowed)
    .get(redes.list)
    .post(redes.create);

  app.route('/api/redes/:redeId').all(redesPolicy.isAllowed)
    .get(redes.read)
    .put(redes.update)
    .delete(redes.delete);

  // Finish by binding the Rede middleware
  app.param('redeId', redes.redeByID);
};
