'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Ambientes Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/ambientes',
      permissions: '*'
    }, {
      resources: '/api/ambientes/:ambienteId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/ambientes',
      permissions: ['get']
    }, {
      resources: '/api/ambientes/:ambienteId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Ambientes Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Ambiente is being processed and the current user created it then allow any manipulation
  if (req.ambiente && req.user && req.ambiente.user && req.ambiente.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else if (!req.user || !req.ambiente.user) { // JOEL: testa se nao possui usuario logado retorna erro 401
        return res.status(401).send('Not user logged');
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
