'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Firewall = mongoose.model('Firewall'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Firewall
 */
exports.create = function(req, res) {
  var firewall = new Firewall(req.body);

  firewall.user = req.user;

  firewall.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(firewall);
    }
  });
};

/**
 * Show the current Firewall
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var firewall = req.firewall ? req.firewall.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  firewall.isCurrentUserOwner = req.user && firewall.user && firewall.user._id.toString() === req.user._id.toString();

  res.jsonp(firewall);
};

/**
 * Update a Firewall
 */
exports.update = function(req, res) {
  var firewall = req.firewall;

  firewall = _.extend(firewall, req.body);

  firewall.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(firewall);
    }
  });
};

/**
 * Delete an Firewall
 */
exports.delete = function(req, res) {
  var firewall = req.firewall;

  firewall.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(firewall);
    }
  });
};

/**
 * List of Firewalls
 */
exports.list = function (req, res) {
  Firewall.find().sort('-created').populate('user', 'displayName').exec(function(err, firewalls) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(firewalls);
    }
  });
};

/**
 * Firewall middleware
 */
exports.firewallByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Firewall is invalid'
    });
  }

  Firewall.findById(id).populate('user', 'displayName').exec(function (err, firewall) {
    if (err) {
      return next(err);
    } else if (!firewall) {
      return res.status(404).send({
        message: 'Nenhuma firewall com esse identificador foi encontrado'
      });
    }
    req.firewall = firewall;
    next();
  });
};
