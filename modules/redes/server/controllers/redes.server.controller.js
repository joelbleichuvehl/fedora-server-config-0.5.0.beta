'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rede = mongoose.model('Rede'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Rede
 */
exports.create = function(req, res) {
  var rede = new Rede(req.body);

  rede.user = req.user;

  rede.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rede);
    }
  });
};

/**
 * Show the current Rede
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var rede = req.rede ? req.rede.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  rede.isCurrentUserOwner = req.user && rede.user && rede.user._id.toString() === req.user._id.toString();

  res.jsonp(rede);
};

/**
 * Update a Rede
 */
exports.update = function(req, res) {
  var rede = req.rede;

  rede = _.extend(rede, req.body);

  rede.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rede);
    }
  });
};

/**
 * Delete an Rede
 */
exports.delete = function(req, res) {
  var rede = req.rede;

  rede.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rede);
    }
  });
};

/**
 * List of Redes
 */
exports.list = function (req, res) {
  Rede.find().sort('-created').populate('user', 'displayName').exec(function(err, redes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(redes);
    }
  });
};

/**
 * Rede middleware
 */
exports.redeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Rede is invalid'
    });
  }

  Rede.findById(id).populate('user', 'displayName').exec(function (err, rede) {
    if (err) {
      return next(err);
    } else if (!rede) {
      return res.status(404).send({
        message: 'No Rede with that identifier has been found'
      });
    }
    req.rede = rede;
    next();
  });
};
