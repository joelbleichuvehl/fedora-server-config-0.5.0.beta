'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Dispositivo = mongoose.model('Dispositivo'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Dispositivo
 */
exports.create = function(req, res) {
  var dispositivo = new Dispositivo(req.body);

  dispositivo.user = req.user;

  dispositivo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dispositivo);
    }
  });
};

/**
 * Show the current Dispositivo
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var dispositivo = req.dispositivo ? req.dispositivo.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  dispositivo.isCurrentUserOwner = req.user && dispositivo.user && dispositivo.user._id.toString() === req.user._id.toString();

  res.jsonp(dispositivo);
};

/**
 * Update a Dispositivo
 */
exports.update = function(req, res) {
  var dispositivo = req.dispositivo;

  dispositivo = _.extend(dispositivo, req.body);

  dispositivo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dispositivo);
    }
  });
};

/**
 * Delete an Dispositivo
 */
exports.delete = function(req, res) {
  var dispositivo = req.dispositivo;

  dispositivo.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dispositivo);
    }
  });
};

/**
 * List of Dispositivos
 */
exports.list = function (req, res) {
  Dispositivo.find().sort('-created').populate('user', 'displayName').exec(function(err, dispositivos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dispositivos);
    }
  });
};

/**
 * Dispositivo middleware
 */
exports.dispositivoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Dispositivo is invalid'
    });
  }

  Dispositivo.findById(id).populate('user', 'displayName').exec(function (err, dispositivo) {
    if (err) {
      return next(err);
    } else if (!dispositivo) {
      return res.status(404).send({
        message: 'No Dispositivo with that identifier has been found'
      });
    }
    req.dispositivo = dispositivo;
    next();
  });
};
