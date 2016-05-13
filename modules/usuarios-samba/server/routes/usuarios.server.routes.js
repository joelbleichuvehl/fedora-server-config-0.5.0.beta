'use strict';

/**
 * Module dependencies
 */
var usuariosPolicy = require('../policies/usuarios.server.policy'),
  usuarios = require('../controllers/usuarios.server.controller');

module.exports = function(app) {
  // Usuarios Routes
  app.route('/api/usuarios').all(usuariosPolicy.isAllowed)
    .get(usuarios.list)
    .post(usuarios.create);

  app.route('/api/usuarios/:usuarioId').all(usuariosPolicy.isAllowed)
    .get(usuarios.read)
    .put(usuarios.update)
    .delete(usuarios.delete);

  // Finish by binding the Usuario middleware
  app.param('usuarioId', usuarios.usuarioByID);
};
