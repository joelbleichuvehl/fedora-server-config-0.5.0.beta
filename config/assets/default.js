'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/css/bootstrap-fedora.css',
        'public/lib/font-awesome/css/font-awesome.css',
        'public/lib/angular-chart.js/dist/angular-chart.css',
        'public/lib/nvd3/build/nv.d3.css',
        'public/lib/ihover/src/ihover.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.js',
        'public/lib/owasp-password-strength-test-pt-br/owasp-password-strength-test.js',
        'public/lib/ngMask/dist/ngMask.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/Chart.js/Chart.js',
        'public/lib/angular-chart.js/dist/angular-chart.js',
        'public/lib/d3/d3.js',
        'public/lib/nvd3/build/nv.d3.js',
        'public/lib/angular-nvd3/dist/angular-nvd3.js',
        'public/lib/jquery.easy-pie-chart/dist/angular.easypiechart.js',
        'public/lib/angular-google-chart/ng-google-chart.js'
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: ['gruntfile.js'],
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
