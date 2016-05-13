'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Grupo = mongoose.model('Grupo'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Grupo
 */
exports.create = function(req, res) {
  var grupo = new Grupo(req.body);

  grupo.user = req.user;

  grupo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(grupo);
    }
  });
};

/**
 * Show the current Grupo
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var grupo = req.grupo ? req.grupo.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  grupo.isCurrentUserOwner = req.user && grupo.user && grupo.user._id.toString() === req.user._id.toString();

  res.jsonp(grupo);
};

/**
 * Update a Grupo
 */
exports.update = function(req, res) {
  var grupo = req.grupo;

  grupo = _.extend(grupo, req.body);

  grupo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(grupo);
    }
  });
};

/**
 * Delete an Grupo
 */
exports.delete = function(req, res) {
  var grupo = req.grupo;

  grupo.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(grupo);
    }
  });
};

/**
 * List of Grupos
 */
exports.list = function (req, res) {
  Grupo.find().sort('-created').populate('user', 'displayName').exec(function(err, grupos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(grupos);
    }
  });
};

/**
 * Grupo middleware
 */
exports.grupoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Grupo is invalid'
    });
  }

  Grupo.findById(id).populate('user', 'displayName').exec(function (err, grupo) {
    if (err) {
      return next(err);
    } else if (!grupo) {
      return res.status(404).send({
        message: 'No Grupo with that identifier has been found'
      });
    }
    req.grupo = grupo;
    next();
  });
};
