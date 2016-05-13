'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Dispositivo = mongoose.model('Dispositivo');

/**
 * Globals
 */
var user,
  dispositivo;

/**
 * Unit tests
 */
describe('Dispositivo Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      dispositivo = new Dispositivo({
        name: 'Dispositivo Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return dispositivo.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      dispositivo.name = '';

      return dispositivo.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Dispositivo.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
