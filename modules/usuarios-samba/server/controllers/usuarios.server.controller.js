'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Usuario = mongoose.model('Usuario'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Usuario
 */
exports.create = function(req, res) {
  var usuario = new Usuario(req.body);

  usuario.user = req.user;

  usuario.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(usuario);
    }
  });
};

/**
 * Show the current Usuario
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var usuario = req.usuario ? req.usuario.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  usuario.isCurrentUserOwner = req.user && usuario.user && usuario.user._id.toString() === req.user._id.toString();

  res.jsonp(usuario);
};

/**
 * Update a Usuario
 */
exports.update = function(req, res) {
  var usuario = req.usuario;

  usuario = _.extend(usuario, req.body);

  usuario.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(usuario);
    }
  });
};

/**
 * Delete an Usuario
 */
exports.delete = function(req, res) {
  var usuario = req.usuario;

  usuario.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(usuario);
    }
  });
};

/**
 * List of Usuarios
 */
exports.list = function(req, res) {
  Usuario.find().sort('-created').populate('user', 'displayName').populate('grupos').exec(function(err, usuarios) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(usuarios);
    }
  });
};

/**
 * Usuario middleware
 */
exports.usuarioByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Usuario is invalid'
    });
  }

  Usuario.findById(id).populate('user', 'displayName').populate('grupos').exec(function (err, usuario) {
    if (err) {
      return next(err);
    } else if (!usuario) {
      return res.status(404).send({
        message: 'No Usuario with that identifier has been found'
      });
    }
    req.usuario = usuario;
    next();
  });
};
