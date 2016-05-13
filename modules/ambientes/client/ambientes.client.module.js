(function (app) {
  'use strict';

  app.registerModule('ambientes');
  app.registerModule('ambientes.services');
  app.registerModule('ambientes.routes', ['ui.router', 'ambientes.services']);
}(ApplicationConfiguration));
