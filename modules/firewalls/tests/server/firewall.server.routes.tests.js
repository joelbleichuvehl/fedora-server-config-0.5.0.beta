'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Firewall = mongoose.model('Firewall'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  firewall;

/**
 * Firewall routes tests
 */
describe('Firewall CRUD tests', function () {

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

    // Save a user to the test db and create new Firewall
    user.save(function () {
      firewall = {
        name: 'Firewall name'
      };

      done();
    });
  });

  it('should be able to save a Firewall if logged in', function (done) {
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

        // Save a new Firewall
        agent.post('/api/firewalls')
          .send(firewall)
          .expect(200)
          .end(function (firewallSaveErr, firewallSaveRes) {
            // Handle Firewall save error
            if (firewallSaveErr) {
              return done(firewallSaveErr);
            }

            // Get a list of Firewalls
            agent.get('/api/firewalls')
              .end(function (firewallsGetErr, firewallsGetRes) {
                // Handle Firewall save error
                if (firewallsGetErr) {
                  return done(firewallsGetErr);
                }

                // Get Firewalls list
                var firewalls = firewallsGetRes.body;

                // Set assertions
                (firewalls[0].user._id).should.equal(userId);
                (firewalls[0].name).should.match('Firewall name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Firewall if not logged in', function (done) {
    agent.post('/api/firewalls')
      .send(firewall)
      .expect(403)
      .end(function (firewallSaveErr, firewallSaveRes) {
        // Call the assertion callback
        done(firewallSaveErr);
      });
  });

  it('should not be able to save an Firewall if no name is provided', function (done) {
    // Invalidate name field
    firewall.name = '';

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

        // Save a new Firewall
        agent.post('/api/firewalls')
          .send(firewall)
          .expect(400)
          .end(function (firewallSaveErr, firewallSaveRes) {
            // Set message assertion
            (firewallSaveRes.body.message).should.match('Please fill Firewall name');

            // Handle Firewall save error
            done(firewallSaveErr);
          });
      });
  });

  it('should be able to update an Firewall if signed in', function (done) {
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

        // Save a new Firewall
        agent.post('/api/firewalls')
          .send(firewall)
          .expect(200)
          .end(function (firewallSaveErr, firewallSaveRes) {
            // Handle Firewall save error
            if (firewallSaveErr) {
              return done(firewallSaveErr);
            }

            // Update Firewall name
            firewall.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Firewall
            agent.put('/api/firewalls/' + firewallSaveRes.body._id)
              .send(firewall)
              .expect(200)
              .end(function (firewallUpdateErr, firewallUpdateRes) {
                // Handle Firewall update error
                if (firewallUpdateErr) {
                  return done(firewallUpdateErr);
                }

                // Set assertions
                (firewallUpdateRes.body._id).should.equal(firewallSaveRes.body._id);
                (firewallUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Firewalls if not signed in', function (done) {
    // Create new Firewall model instance
    var firewallObj = new Firewall(firewall);

    // Save the firewall
    firewallObj.save(function () {
      // Request Firewalls
      request(app).get('/api/firewalls')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Firewall if not signed in', function (done) {
    // Create new Firewall model instance
    var firewallObj = new Firewall(firewall);

    // Save the Firewall
    firewallObj.save(function () {
      request(app).get('/api/firewalls/' + firewallObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', firewall.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Firewall with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/firewalls/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Firewall is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Firewall which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Firewall
    request(app).get('/api/firewalls/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Firewall with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Firewall if signed in', function (done) {
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

        // Save a new Firewall
        agent.post('/api/firewalls')
          .send(firewall)
          .expect(200)
          .end(function (firewallSaveErr, firewallSaveRes) {
            // Handle Firewall save error
            if (firewallSaveErr) {
              return done(firewallSaveErr);
            }

            // Delete an existing Firewall
            agent.delete('/api/firewalls/' + firewallSaveRes.body._id)
              .send(firewall)
              .expect(200)
              .end(function (firewallDeleteErr, firewallDeleteRes) {
                // Handle firewall error error
                if (firewallDeleteErr) {
                  return done(firewallDeleteErr);
                }

                // Set assertions
                (firewallDeleteRes.body._id).should.equal(firewallSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Firewall if not signed in', function (done) {
    // Set Firewall user
    firewall.user = user;

    // Create new Firewall model instance
    var firewallObj = new Firewall(firewall);

    // Save the Firewall
    firewallObj.save(function () {
      // Try deleting Firewall
      request(app).delete('/api/firewalls/' + firewallObj._id)
        .expect(403)
        .end(function (firewallDeleteErr, firewallDeleteRes) {
          // Set message assertion
          (firewallDeleteRes.body.message).should.match('User is not authorized');

          // Handle Firewall error error
          done(firewallDeleteErr);
        });

    });
  });

  it('should be able to get a single Firewall that has an orphaned user reference', function (done) {
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

          // Save a new Firewall
          agent.post('/api/firewalls')
            .send(firewall)
            .expect(200)
            .end(function (firewallSaveErr, firewallSaveRes) {
              // Handle Firewall save error
              if (firewallSaveErr) {
                return done(firewallSaveErr);
              }

              // Set assertions on new Firewall
              (firewallSaveRes.body.name).should.equal(firewall.name);
              should.exist(firewallSaveRes.body.user);
              should.equal(firewallSaveRes.body.user._id, orphanId);

              // force the Firewall to have an orphaned user reference
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

                    // Get the Firewall
                    agent.get('/api/firewalls/' + firewallSaveRes.body._id)
                      .expect(200)
                      .end(function (firewallInfoErr, firewallInfoRes) {
                        // Handle Firewall error
                        if (firewallInfoErr) {
                          return done(firewallInfoErr);
                        }

                        // Set assertions
                        (firewallInfoRes.body._id).should.equal(firewallSaveRes.body._id);
                        (firewallInfoRes.body.name).should.equal(firewall.name);
                        should.equal(firewallInfoRes.body.user, undefined);

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
      Firewall.remove().exec(done);
    });
  });
});
