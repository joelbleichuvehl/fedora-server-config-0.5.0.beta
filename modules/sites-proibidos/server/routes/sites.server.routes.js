'use strict';

/**
 * Module dependencies
 */
var sitesPolicy = require('../policies/sites.server.policy'),
  sites = require('../controllers/sites.server.controller');

module.exports = function(app) {
  // Sites Routes
  app.route('/api/sites').all(sitesPolicy.isAllowed)
    .get(sites.list)
    .post(sites.create);

  app.route('/api/sites/:siteId').all(sitesPolicy.isAllowed)
    .get(sites.read)
    .put(sites.update)
    .delete(sites.delete);

  // Finish by binding the Site middleware
  app.param('siteId', sites.siteByID);
};
