'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Donload = mongoose.model('Donload'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  donload;

/**
 * Donload routes tests
 */
describe('Donload CRUD tests', function () {

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

    // Save a user to the test db and create new Donload
    user.save(function () {
      donload = {
        name: 'Donload name'
      };

      done();
    });
  });

  it('should be able to save a Donload if logged in', function (done) {
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

        // Save a new Donload
        agent.post('/api/donloads')
          .send(donload)
          .expect(200)
          .end(function (donloadSaveErr, donloadSaveRes) {
            // Handle Donload save error
            if (donloadSaveErr) {
              return done(donloadSaveErr);
            }

            // Get a list of Donloads
            agent.get('/api/donloads')
              .end(function (donloadsGetErr, donloadsGetRes) {
                // Handle Donload save error
                if (donloadsGetErr) {
                  return done(donloadsGetErr);
                }

                // Get Donloads list
                var donloads = donloadsGetRes.body;

                // Set assertions
                (donloads[0].user._id).should.equal(userId);
                (donloads[0].name).should.match('Donload name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Donload if not logged in', function (done) {
    agent.post('/api/donloads')
      .send(donload)
      .expect(403)
      .end(function (donloadSaveErr, donloadSaveRes) {
        // Call the assertion callback
        done(donloadSaveErr);
      });
  });

  it('should not be able to save an Donload if no name is provided', function (done) {
    // Invalidate name field
    donload.name = '';

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

        // Save a new Donload
        agent.post('/api/donloads')
          .send(donload)
          .expect(400)
          .end(function (donloadSaveErr, donloadSaveRes) {
            // Set message assertion
            (donloadSaveRes.body.message).should.match('Please fill Donload name');

            // Handle Donload save error
            done(donloadSaveErr);
          });
      });
  });

  it('should be able to update an Donload if signed in', function (done) {
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

        // Save a new Donload
        agent.post('/api/donloads')
          .send(donload)
          .expect(200)
          .end(function (donloadSaveErr, donloadSaveRes) {
            // Handle Donload save error
            if (donloadSaveErr) {
              return done(donloadSaveErr);
            }

            // Update Donload name
            donload.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Donload
            agent.put('/api/donloads/' + donloadSaveRes.body._id)
              .send(donload)
              .expect(200)
              .end(function (donloadUpdateErr, donloadUpdateRes) {
                // Handle Donload update error
                if (donloadUpdateErr) {
                  return done(donloadUpdateErr);
                }

                // Set assertions
                (donloadUpdateRes.body._id).should.equal(donloadSaveRes.body._id);
                (donloadUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Donloads if not signed in', function (done) {
    // Create new Donload model instance
    var donloadObj = new Donload(donload);

    // Save the donload
    donloadObj.save(function () {
      // Request Donloads
      request(app).get('/api/donloads')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Donload if not signed in', function (done) {
    // Create new Donload model instance
    var donloadObj = new Donload(donload);

    // Save the Donload
    donloadObj.save(function () {
      request(app).get('/api/donloads/' + donloadObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', donload.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Donload with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/donloads/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Donload is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Donload which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Donload
    request(app).get('/api/donloads/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Donload with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Donload if signed in', function (done) {
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

        // Save a new Donload
        agent.post('/api/donloads')
          .send(donload)
          .expect(200)
          .end(function (donloadSaveErr, donloadSaveRes) {
            // Handle Donload save error
            if (donloadSaveErr) {
              return done(donloadSaveErr);
            }

            // Delete an existing Donload
            agent.delete('/api/donloads/' + donloadSaveRes.body._id)
              .send(donload)
              .expect(200)
              .end(function (donloadDeleteErr, donloadDeleteRes) {
                // Handle donload error error
                if (donloadDeleteErr) {
                  return done(donloadDeleteErr);
                }

                // Set assertions
                (donloadDeleteRes.body._id).should.equal(donloadSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Donload if not signed in', function (done) {
    // Set Donload user
    donload.user = user;

    // Create new Donload model instance
    var donloadObj = new Donload(donload);

    // Save the Donload
    donloadObj.save(function () {
      // Try deleting Donload
      request(app).delete('/api/donloads/' + donloadObj._id)
        .expect(403)
        .end(function (donloadDeleteErr, donloadDeleteRes) {
          // Set message assertion
          (donloadDeleteRes.body.message).should.match('User is not authorized');

          // Handle Donload error error
          done(donloadDeleteErr);
        });

    });
  });

  it('should be able to get a single Donload that has an orphaned user reference', function (done) {
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

          // Save a new Donload
          agent.post('/api/donloads')
            .send(donload)
            .expect(200)
            .end(function (donloadSaveErr, donloadSaveRes) {
              // Handle Donload save error
              if (donloadSaveErr) {
                return done(donloadSaveErr);
              }

              // Set assertions on new Donload
              (donloadSaveRes.body.name).should.equal(donload.name);
              should.exist(donloadSaveRes.body.user);
              should.equal(donloadSaveRes.body.user._id, orphanId);

              // force the Donload to have an orphaned user reference
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

                    // Get the Donload
                    agent.get('/api/donloads/' + donloadSaveRes.body._id)
                      .expect(200)
                      .end(function (donloadInfoErr, donloadInfoRes) {
                        // Handle Donload error
                        if (donloadInfoErr) {
                          return done(donloadInfoErr);
                        }

                        // Set assertions
                        (donloadInfoRes.body._id).should.equal(donloadSaveRes.body._id);
                        (donloadInfoRes.body.name).should.equal(donload.name);
                        should.equal(donloadInfoRes.body.user, undefined);

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
      Donload.remove().exec(done);
    });
  });
});
