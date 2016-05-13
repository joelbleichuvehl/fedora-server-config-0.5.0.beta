'use strict';

/**
 * Module dependencies
 */
var firewallsPolicy = require('../policies/firewalls.server.policy'),
  firewalls = require('../controllers/firewalls.server.controller');

module.exports = function(app) {
  // Firewalls Routes
  app.route('/api/firewalls').all(firewallsPolicy.isAllowed)
    .get(firewalls.list)
    .post(firewalls.create);

  app.route('/api/firewalls/:firewallId').all(firewallsPolicy.isAllowed)
    .get(firewalls.read)
    .put(firewalls.update)
    .delete(firewalls.delete);

  // Finish by binding the Firewall middleware
  app.param('firewallId', firewalls.firewallByID);
};
