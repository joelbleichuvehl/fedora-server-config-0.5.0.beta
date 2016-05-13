'use strict';

/**
 * Module dependencies
 */
var gruposPolicy = require('../policies/grupos.server.policy'),
  grupos = require('../controllers/grupos.server.controller');

module.exports = function(app) {
  // Grupos Routes
  app.route('/api/grupos').all(gruposPolicy.isAllowed)
    .get(grupos.list)
    .post(grupos.create);

  app.route('/api/grupos/:grupoId').all(gruposPolicy.isAllowed)
    .get(grupos.read)
    .put(grupos.update)
    .delete(grupos.delete);

  // Finish by binding the Grupo middleware
  app.param('grupoId', grupos.grupoByID);
};
