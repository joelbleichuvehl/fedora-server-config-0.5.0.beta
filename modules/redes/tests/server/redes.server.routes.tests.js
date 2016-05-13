'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Rede = mongoose.model('Rede'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  rede;

/**
 * Rede routes tests
 */
describe('Rede CRUD tests', function () {

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

    // Save a user to the test db and create new Rede
    user.save(function () {
      rede = {
        name: 'Rede name'
      };

      done();
    });
  });

  it('should be able to save a Rede if logged in', function (done) {
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

        // Save a new Rede
        agent.post('/api/redes')
          .send(rede)
          .expect(200)
          .end(function (redeSaveErr, redeSaveRes) {
            // Handle Rede save error
            if (redeSaveErr) {
              return done(redeSaveErr);
            }

            // Get a list of Redes
            agent.get('/api/redes')
              .end(function (redesGetErr, redesGetRes) {
                // Handle Rede save error
                if (redesGetErr) {
                  return done(redesGetErr);
                }

                // Get Redes list
                var redes = redesGetRes.body;

                // Set assertions
                (redes[0].user._id).should.equal(userId);
                (redes[0].name).should.match('Rede name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Rede if not logged in', function (done) {
    agent.post('/api/redes')
      .send(rede)
      .expect(403)
      .end(function (redeSaveErr, redeSaveRes) {
        // Call the assertion callback
        done(redeSaveErr);
      });
  });

  it('should not be able to save an Rede if no name is provided', function (done) {
    // Invalidate name field
    rede.name = '';

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

        // Save a new Rede
        agent.post('/api/redes')
          .send(rede)
          .expect(400)
          .end(function (redeSaveErr, redeSaveRes) {
            // Set message assertion
            (redeSaveRes.body.message).should.match('Please fill Rede name');

            // Handle Rede save error
            done(redeSaveErr);
          });
      });
  });

  it('should be able to update an Rede if signed in', function (done) {
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

        // Save a new Rede
        agent.post('/api/redes')
          .send(rede)
          .expect(200)
          .end(function (redeSaveErr, redeSaveRes) {
            // Handle Rede save error
            if (redeSaveErr) {
              return done(redeSaveErr);
            }

            // Update Rede name
            rede.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Rede
            agent.put('/api/redes/' + redeSaveRes.body._id)
              .send(rede)
              .expect(200)
              .end(function (redeUpdateErr, redeUpdateRes) {
                // Handle Rede update error
                if (redeUpdateErr) {
                  return done(redeUpdateErr);
                }

                // Set assertions
                (redeUpdateRes.body._id).should.equal(redeSaveRes.body._id);
                (redeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Redes if not signed in', function (done) {
    // Create new Rede model instance
    var redeObj = new Rede(rede);

    // Save the rede
    redeObj.save(function () {
      // Request Redes
      request(app).get('/api/redes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Rede if not signed in', function (done) {
    // Create new Rede model instance
    var redeObj = new Rede(rede);

    // Save the Rede
    redeObj.save(function () {
      request(app).get('/api/redes/' + redeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', rede.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Rede with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/redes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Rede is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Rede which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Rede
    request(app).get('/api/redes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Rede with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Rede if signed in', function (done) {
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

        // Save a new Rede
        agent.post('/api/redes')
          .send(rede)
          .expect(200)
          .end(function (redeSaveErr, redeSaveRes) {
            // Handle Rede save error
            if (redeSaveErr) {
              return done(redeSaveErr);
            }

            // Delete an existing Rede
            agent.delete('/api/redes/' + redeSaveRes.body._id)
              .send(rede)
              .expect(200)
              .end(function (redeDeleteErr, redeDeleteRes) {
                // Handle rede error error
                if (redeDeleteErr) {
                  return done(redeDeleteErr);
                }

                // Set assertions
                (redeDeleteRes.body._id).should.equal(redeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Rede if not signed in', function (done) {
    // Set Rede user
    rede.user = user;

    // Create new Rede model instance
    var redeObj = new Rede(rede);

    // Save the Rede
    redeObj.save(function () {
      // Try deleting Rede
      request(app).delete('/api/redes/' + redeObj._id)
        .expect(403)
        .end(function (redeDeleteErr, redeDeleteRes) {
          // Set message assertion
          (redeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Rede error error
          done(redeDeleteErr);
        });

    });
  });

  it('should be able to get a single Rede that has an orphaned user reference', function (done) {
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

          // Save a new Rede
          agent.post('/api/redes')
            .send(rede)
            .expect(200)
            .end(function (redeSaveErr, redeSaveRes) {
              // Handle Rede save error
              if (redeSaveErr) {
                return done(redeSaveErr);
              }

              // Set assertions on new Rede
              (redeSaveRes.body.name).should.equal(rede.name);
              should.exist(redeSaveRes.body.user);
              should.equal(redeSaveRes.body.user._id, orphanId);

              // force the Rede to have an orphaned user reference
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

                    // Get the Rede
                    agent.get('/api/redes/' + redeSaveRes.body._id)
                      .expect(200)
                      .end(function (redeInfoErr, redeInfoRes) {
                        // Handle Rede error
                        if (redeInfoErr) {
                          return done(redeInfoErr);
                        }

                        // Set assertions
                        (redeInfoRes.body._id).should.equal(redeSaveRes.body._id);
                        (redeInfoRes.body.name).should.equal(rede.name);
                        should.equal(redeInfoRes.body.user, undefined);

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
      Rede.remove().exec(done);
    });
  });
});
