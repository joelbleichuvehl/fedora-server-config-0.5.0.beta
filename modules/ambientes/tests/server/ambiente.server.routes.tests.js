'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ambiente = mongoose.model('Ambiente'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  ambiente;

/**
 * Ambiente routes tests
 */
describe('Ambiente CRUD tests', function () {

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

    // Save a user to the test db and create new Ambiente
    user.save(function () {
      ambiente = {
        name: 'Ambiente name'
      };

      done();
    });
  });

  it('should be able to save a Ambiente if logged in', function (done) {
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

        // Save a new Ambiente
        agent.post('/api/ambientes')
          .send(ambiente)
          .expect(200)
          .end(function (ambienteSaveErr, ambienteSaveRes) {
            // Handle Ambiente save error
            if (ambienteSaveErr) {
              return done(ambienteSaveErr);
            }

            // Get a list of Ambientes
            agent.get('/api/ambientes')
              .end(function (ambientesGetErr, ambientesGetRes) {
                // Handle Ambiente save error
                if (ambientesGetErr) {
                  return done(ambientesGetErr);
                }

                // Get Ambientes list
                var ambientes = ambientesGetRes.body;

                // Set assertions
                (ambientes[0].user._id).should.equal(userId);
                (ambientes[0].name).should.match('Ambiente name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Ambiente if not logged in', function (done) {
    agent.post('/api/ambientes')
      .send(ambiente)
      .expect(403)
      .end(function (ambienteSaveErr, ambienteSaveRes) {
        // Call the assertion callback
        done(ambienteSaveErr);
      });
  });

  it('should not be able to save an Ambiente if no name is provided', function (done) {
    // Invalidate name field
    ambiente.name = '';

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

        // Save a new Ambiente
        agent.post('/api/ambientes')
          .send(ambiente)
          .expect(400)
          .end(function (ambienteSaveErr, ambienteSaveRes) {
            // Set message assertion
            (ambienteSaveRes.body.message).should.match('Please fill Ambiente name');

            // Handle Ambiente save error
            done(ambienteSaveErr);
          });
      });
  });

  it('should be able to update an Ambiente if signed in', function (done) {
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

        // Save a new Ambiente
        agent.post('/api/ambientes')
          .send(ambiente)
          .expect(200)
          .end(function (ambienteSaveErr, ambienteSaveRes) {
            // Handle Ambiente save error
            if (ambienteSaveErr) {
              return done(ambienteSaveErr);
            }

            // Update Ambiente name
            ambiente.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Ambiente
            agent.put('/api/ambientes/' + ambienteSaveRes.body._id)
              .send(ambiente)
              .expect(200)
              .end(function (ambienteUpdateErr, ambienteUpdateRes) {
                // Handle Ambiente update error
                if (ambienteUpdateErr) {
                  return done(ambienteUpdateErr);
                }

                // Set assertions
                (ambienteUpdateRes.body._id).should.equal(ambienteSaveRes.body._id);
                (ambienteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Ambientes if not signed in', function (done) {
    // Create new Ambiente model instance
    var ambienteObj = new Ambiente(ambiente);

    // Save the ambiente
    ambienteObj.save(function () {
      // Request Ambientes
      request(app).get('/api/ambientes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Ambiente if not signed in', function (done) {
    // Create new Ambiente model instance
    var ambienteObj = new Ambiente(ambiente);

    // Save the Ambiente
    ambienteObj.save(function () {
      request(app).get('/api/ambientes/' + ambienteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', ambiente.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Ambiente with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ambientes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Ambiente is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Ambiente which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Ambiente
    request(app).get('/api/ambientes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Ambiente with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Ambiente if signed in', function (done) {
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

        // Save a new Ambiente
        agent.post('/api/ambientes')
          .send(ambiente)
          .expect(200)
          .end(function (ambienteSaveErr, ambienteSaveRes) {
            // Handle Ambiente save error
            if (ambienteSaveErr) {
              return done(ambienteSaveErr);
            }

            // Delete an existing Ambiente
            agent.delete('/api/ambientes/' + ambienteSaveRes.body._id)
              .send(ambiente)
              .expect(200)
              .end(function (ambienteDeleteErr, ambienteDeleteRes) {
                // Handle ambiente error error
                if (ambienteDeleteErr) {
                  return done(ambienteDeleteErr);
                }

                // Set assertions
                (ambienteDeleteRes.body._id).should.equal(ambienteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Ambiente if not signed in', function (done) {
    // Set Ambiente user
    ambiente.user = user;

    // Create new Ambiente model instance
    var ambienteObj = new Ambiente(ambiente);

    // Save the Ambiente
    ambienteObj.save(function () {
      // Try deleting Ambiente
      request(app).delete('/api/ambientes/' + ambienteObj._id)
        .expect(403)
        .end(function (ambienteDeleteErr, ambienteDeleteRes) {
          // Set message assertion
          (ambienteDeleteRes.body.message).should.match('User is not authorized');

          // Handle Ambiente error error
          done(ambienteDeleteErr);
        });

    });
  });

  it('should be able to get a single Ambiente that has an orphaned user reference', function (done) {
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

          // Save a new Ambiente
          agent.post('/api/ambientes')
            .send(ambiente)
            .expect(200)
            .end(function (ambienteSaveErr, ambienteSaveRes) {
              // Handle Ambiente save error
              if (ambienteSaveErr) {
                return done(ambienteSaveErr);
              }

              // Set assertions on new Ambiente
              (ambienteSaveRes.body.name).should.equal(ambiente.name);
              should.exist(ambienteSaveRes.body.user);
              should.equal(ambienteSaveRes.body.user._id, orphanId);

              // force the Ambiente to have an orphaned user reference
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

                    // Get the Ambiente
                    agent.get('/api/ambientes/' + ambienteSaveRes.body._id)
                      .expect(200)
                      .end(function (ambienteInfoErr, ambienteInfoRes) {
                        // Handle Ambiente error
                        if (ambienteInfoErr) {
                          return done(ambienteInfoErr);
                        }

                        // Set assertions
                        (ambienteInfoRes.body._id).should.equal(ambienteSaveRes.body._id);
                        (ambienteInfoRes.body.name).should.equal(ambiente.name);
                        should.equal(ambienteInfoRes.body.user, undefined);

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
      Ambiente.remove().exec(done);
    });
  });
});
