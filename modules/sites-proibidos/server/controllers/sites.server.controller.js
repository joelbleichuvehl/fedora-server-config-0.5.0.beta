'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Site = mongoose.model('Site'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Site
 */
exports.create = function(req, res) {
  var site = new Site(req.body);

  site.user = req.user;

  site.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(site);
    }
  });
};

/**
 * Show the current Site
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var site = req.site ? req.site.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  site.isCurrentUserOwner = req.user && site.user && site.user._id.toString() === req.user._id.toString();

  res.jsonp(site);
};

/**
 * Update a Site
 */
exports.update = function(req, res) {
  var site = req.site;

  site = _.extend(site, req.body);

  site.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(site);
    }
  });
};

/**
 * Delete an Site
 */
exports.delete = function(req, res) {
  var site = req.site;

  site.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(site);
    }
  });
};

/**
 * List of Sites
 */
exports.list = function (req, res) {
  Site.find().sort('-created').populate('user', 'displayName').exec(function(err, sites) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sites);
    }
  });
};

/**
 * Site middleware
 */
exports.siteByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Site is invalid'
    });
  }

  Site.findById(id).populate('user', 'displayName').exec(function (err, site) {
    if (err) {
      return next(err);
    } else if (!site) {
      return res.status(404).send({
        message: 'No Site with that identifier has been found'
      });
    }
    req.site = site;
    next();
  });
};
