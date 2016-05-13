'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Grupo = mongoose.model('Grupo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  grupo;

/**
 * Grupo routes tests
 */
describe('Grupo CRUD tests', function () {

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

    // Save a user to the test db and create new Grupo
    user.save(function () {
      grupo = {
        name: 'Grupo name'
      };

      done();
    });
  });

  it('should be able to save a Grupo if logged in', function (done) {
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

        // Save a new Grupo
        agent.post('/api/grupos')
          .send(grupo)
          .expect(200)
          .end(function (grupoSaveErr, grupoSaveRes) {
            // Handle Grupo save error
            if (grupoSaveErr) {
              return done(grupoSaveErr);
            }

            // Get a list of Grupos
            agent.get('/api/grupos')
              .end(function (gruposGetErr, gruposGetRes) {
                // Handle Grupo save error
                if (gruposGetErr) {
                  return done(gruposGetErr);
                }

                // Get Grupos list
                var grupos = gruposGetRes.body;

                // Set assertions
                (grupos[0].user._id).should.equal(userId);
                (grupos[0].name).should.match('Grupo name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Grupo if not logged in', function (done) {
    agent.post('/api/grupos')
      .send(grupo)
      .expect(403)
      .end(function (grupoSaveErr, grupoSaveRes) {
        // Call the assertion callback
        done(grupoSaveErr);
      });
  });

  it('should not be able to save an Grupo if no name is provided', function (done) {
    // Invalidate name field
    grupo.name = '';

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

        // Save a new Grupo
        agent.post('/api/grupos')
          .send(grupo)
          .expect(400)
          .end(function (grupoSaveErr, grupoSaveRes) {
            // Set message assertion
            (grupoSaveRes.body.message).should.match('Please fill Grupo name');

            // Handle Grupo save error
            done(grupoSaveErr);
          });
      });
  });

  it('should be able to update an Grupo if signed in', function (done) {
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

        // Save a new Grupo
        agent.post('/api/grupos')
          .send(grupo)
          .expect(200)
          .end(function (grupoSaveErr, grupoSaveRes) {
            // Handle Grupo save error
            if (grupoSaveErr) {
              return done(grupoSaveErr);
            }

            // Update Grupo name
            grupo.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Grupo
            agent.put('/api/grupos/' + grupoSaveRes.body._id)
              .send(grupo)
              .expect(200)
              .end(function (grupoUpdateErr, grupoUpdateRes) {
                // Handle Grupo update error
                if (grupoUpdateErr) {
                  return done(grupoUpdateErr);
                }

                // Set assertions
                (grupoUpdateRes.body._id).should.equal(grupoSaveRes.body._id);
                (grupoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Grupos if not signed in', function (done) {
    // Create new Grupo model instance
    var grupoObj = new Grupo(grupo);

    // Save the grupo
    grupoObj.save(function () {
      // Request Grupos
      request(app).get('/api/grupos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Grupo if not signed in', function (done) {
    // Create new Grupo model instance
    var grupoObj = new Grupo(grupo);

    // Save the Grupo
    grupoObj.save(function () {
      request(app).get('/api/grupos/' + grupoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', grupo.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Grupo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/grupos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Grupo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Grupo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Grupo
    request(app).get('/api/grupos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Grupo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Grupo if signed in', function (done) {
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

        // Save a new Grupo
        agent.post('/api/grupos')
          .send(grupo)
          .expect(200)
          .end(function (grupoSaveErr, grupoSaveRes) {
            // Handle Grupo save error
            if (grupoSaveErr) {
              return done(grupoSaveErr);
            }

            // Delete an existing Grupo
            agent.delete('/api/grupos/' + grupoSaveRes.body._id)
              .send(grupo)
              .expect(200)
              .end(function (grupoDeleteErr, grupoDeleteRes) {
                // Handle grupo error error
                if (grupoDeleteErr) {
                  return done(grupoDeleteErr);
                }

                // Set assertions
                (grupoDeleteRes.body._id).should.equal(grupoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Grupo if not signed in', function (done) {
    // Set Grupo user
    grupo.user = user;

    // Create new Grupo model instance
    var grupoObj = new Grupo(grupo);

    // Save the Grupo
    grupoObj.save(function () {
      // Try deleting Grupo
      request(app).delete('/api/grupos/' + grupoObj._id)
        .expect(403)
        .end(function (grupoDeleteErr, grupoDeleteRes) {
          // Set message assertion
          (grupoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Grupo error error
          done(grupoDeleteErr);
        });

    });
  });

  it('should be able to get a single Grupo that has an orphaned user reference', function (done) {
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

          // Save a new Grupo
          agent.post('/api/grupos')
            .send(grupo)
            .expect(200)
            .end(function (grupoSaveErr, grupoSaveRes) {
              // Handle Grupo save error
              if (grupoSaveErr) {
                return done(grupoSaveErr);
              }

              // Set assertions on new Grupo
              (grupoSaveRes.body.name).should.equal(grupo.name);
              should.exist(grupoSaveRes.body.user);
              should.equal(grupoSaveRes.body.user._id, orphanId);

              // force the Grupo to have an orphaned user reference
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

                    // Get the Grupo
                    agent.get('/api/grupos/' + grupoSaveRes.body._id)
                      .expect(200)
                      .end(function (grupoInfoErr, grupoInfoRes) {
                        // Handle Grupo error
                        if (grupoInfoErr) {
                          return done(grupoInfoErr);
                        }

                        // Set assertions
                        (grupoInfoRes.body._id).should.equal(grupoSaveRes.body._id);
                        (grupoInfoRes.body.name).should.equal(grupo.name);
                        should.equal(grupoInfoRes.body.user, undefined);

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
      Grupo.remove().exec(done);
    });
  });
});
