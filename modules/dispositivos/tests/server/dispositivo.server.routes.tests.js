'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Dispositivo = mongoose.model('Dispositivo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  dispositivo;

/**
 * Dispositivo routes tests
 */
describe('Dispositivo CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Dispositivo
    user.save(function () {
      dispositivo = {
        name: 'Dispositivo name'
      };

      done();
    });
  });

  it('should be able to save a Dispositivo if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Dispositivo
        agent.post('/api/dispositivos')
          .send(dispositivo)
          .expect(200)
          .end(function (dispositivoSaveErr, dispositivoSaveRes) {
            // Handle Dispositivo save error
            if (dispositivoSaveErr) {
              return done(dispositivoSaveErr);
            }

            // Get a list of Dispositivos
            agent.get('/api/dispositivos')
              .end(function (dispositivosGetErr, dispositivosGetRes) {
                // Handle Dispositivo save error
                if (dispositivosGetErr) {
                  return done(dispositivosGetErr);
                }

                // Get Dispositivos list
                var dispositivos = dispositivosGetRes.body;

                // Set assertions
                (dispositivos[0].user._id).should.equal(userId);
                (dispositivos[0].name).should.match('Dispositivo name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Dispositivo if not logged in', function (done) {
    agent.post('/api/dispositivos')
      .send(dispositivo)
      .expect(403)
      .end(function (dispositivoSaveErr, dispositivoSaveRes) {
        // Call the assertion callback
        done(dispositivoSaveErr);
      });
  });

  it('should not be able to save an Dispositivo if no name is provided', function (done) {
    // Invalidate name field
    dispositivo.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Dispositivo
        agent.post('/api/dispositivos')
          .send(dispositivo)
          .expect(400)
          .end(function (dispositivoSaveErr, dispositivoSaveRes) {
            // Set message assertion
            (dispositivoSaveRes.body.message).should.match('Please fill Dispositivo name');

            // Handle Dispositivo save error
            done(dispositivoSaveErr);
          });
      });
  });

  it('should be able to update an Dispositivo if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Dispositivo
        agent.post('/api/dispositivos')
          .send(dispositivo)
          .expect(200)
          .end(function (dispositivoSaveErr, dispositivoSaveRes) {
            // Handle Dispositivo save error
            if (dispositivoSaveErr) {
              return done(dispositivoSaveErr);
            }

            // Update Dispositivo name
            dispositivo.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Dispositivo
            agent.put('/api/dispositivos/' + dispositivoSaveRes.body._id)
              .send(dispositivo)
              .expect(200)
              .end(function (dispositivoUpdateErr, dispositivoUpdateRes) {
                // Handle Dispositivo update error
                if (dispositivoUpdateErr) {
                  return done(dispositivoUpdateErr);
                }

                // Set assertions
                (dispositivoUpdateRes.body._id).should.equal(dispositivoSaveRes.body._id);
                (dispositivoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Dispositivos if not signed in', function (done) {
    // Create new Dispositivo model instance
    var dispositivoObj = new Dispositivo(dispositivo);

    // Save the dispositivo
    dispositivoObj.save(function () {
      // Request Dispositivos
      request(app).get('/api/dispositivos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Dispositivo if not signed in', function (done) {
    // Create new Dispositivo model instance
    var dispositivoObj = new Dispositivo(dispositivo);

    // Save the Dispositivo
    dispositivoObj.save(function () {
      request(app).get('/api/dispositivos/' + dispositivoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', dispositivo.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Dispositivo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/dispositivos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Dispositivo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Dispositivo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Dispositivo
    request(app).get('/api/dispositivos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Dispositivo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Dispositivo if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Dispositivo
        agent.post('/api/dispositivos')
          .send(dispositivo)
          .expect(200)
          .end(function (dispositivoSaveErr, dispositivoSaveRes) {
            // Handle Dispositivo save error
            if (dispositivoSaveErr) {
              return done(dispositivoSaveErr);
            }

            // Delete an existing Dispositivo
            agent.delete('/api/dispositivos/' + dispositivoSaveRes.body._id)
              .send(dispositivo)
              .expect(200)
              .end(function (dispositivoDeleteErr, dispositivoDeleteRes) {
                // Handle dispositivo error error
                if (dispositivoDeleteErr) {
                  return done(dispositivoDeleteErr);
                }

                // Set assertions
                (dispositivoDeleteRes.body._id).should.equal(dispositivoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Dispositivo if not signed in', function (done) {
    // Set Dispositivo user
    dispositivo.user = user;

    // Create new Dispositivo model instance
    var dispositivoObj = new Dispositivo(dispositivo);

    // Save the Dispositivo
    dispositivoObj.save(function () {
      // Try deleting Dispositivo
      request(app).delete('/api/dispositivos/' + dispositivoObj._id)
        .expect(403)
        .end(function (dispositivoDeleteErr, dispositivoDeleteRes) {
          // Set message assertion
          (dispositivoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Dispositivo error error
          done(dispositivoDeleteErr);
        });

    });
  });

  it('should be able to get a single Dispositivo that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Dispositivo
          agent.post('/api/dispositivos')
            .send(dispositivo)
            .expect(200)
            .end(function (dispositivoSaveErr, dispositivoSaveRes) {
              // Handle Dispositivo save error
              if (dispositivoSaveErr) {
                return done(dispositivoSaveErr);
              }

              // Set assertions on new Dispositivo
              (dispositivoSaveRes.body.name).should.equal(dispositivo.name);
              should.exist(dispositivoSaveRes.body.user);
              should.equal(dispositivoSaveRes.body.user._id, orphanId);

              // force the Dispositivo to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Dispositivo
                    agent.get('/api/dispositivos/' + dispositivoSaveRes.body._id)
                      .expect(200)
                      .end(function (dispositivoInfoErr, dispositivoInfoRes) {
                        // Handle Dispositivo error
                        if (dispositivoInfoErr) {
                          return done(dispositivoInfoErr);
                        }

                        // Set assertions
                        (dispositivoInfoRes.body._id).should.equal(dispositivoSaveRes.body._id);
                        (dispositivoInfoRes.body.name).should.equal(dispositivo.name);
                        should.equal(dispositivoInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Dispositivo.remove().exec(done);
    });
  });
});
