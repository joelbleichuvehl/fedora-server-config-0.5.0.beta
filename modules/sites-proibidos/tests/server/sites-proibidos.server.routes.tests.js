'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Site = mongoose.model('Site'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  site;

/**
 * Site routes tests
 */
describe('Site CRUD tests', function () {

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

    // Save a user to the test db and create new Site
    user.save(function () {
      site = {
        name: 'Site name'
      };

      done();
    });
  });

  it('should be able to save a Site if logged in', function (done) {
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

        // Save a new Site
        agent.post('/api/sites')
          .send(site)
          .expect(200)
          .end(function (siteSaveErr, siteSaveRes) {
            // Handle Site save error
            if (siteSaveErr) {
              return done(siteSaveErr);
            }

            // Get a list of Sites
            agent.get('/api/sites')
              .end(function (sitesGetErr, sitesGetRes) {
                // Handle Site save error
                if (sitesGetErr) {
                  return done(sitesGetErr);
                }

                // Get Sites list
                var sites = sitesGetRes.body;

                // Set assertions
                (sites[0].user._id).should.equal(userId);
                (sites[0].name).should.match('Site name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Site if not logged in', function (done) {
    agent.post('/api/sites')
      .send(site)
      .expect(403)
      .end(function (siteSaveErr, siteSaveRes) {
        // Call the assertion callback
        done(siteSaveErr);
      });
  });

  it('should not be able to save an Site if no name is provided', function (done) {
    // Invalidate name field
    site.name = '';

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

        // Save a new Site
        agent.post('/api/sites')
          .send(site)
          .expect(400)
          .end(function (siteSaveErr, siteSaveRes) {
            // Set message assertion
            (siteSaveRes.body.message).should.match('Please fill Site name');

            // Handle Site save error
            done(siteSaveErr);
          });
      });
  });

  it('should be able to update an Site if signed in', function (done) {
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

        // Save a new Site
        agent.post('/api/sites')
          .send(site)
          .expect(200)
          .end(function (siteSaveErr, siteSaveRes) {
            // Handle Site save error
            if (siteSaveErr) {
              return done(siteSaveErr);
            }

            // Update Site name
            site.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Site
            agent.put('/api/sites/' + siteSaveRes.body._id)
              .send(site)
              .expect(200)
              .end(function (siteUpdateErr, siteUpdateRes) {
                // Handle Site update error
                if (siteUpdateErr) {
                  return done(siteUpdateErr);
                }

                // Set assertions
                (siteUpdateRes.body._id).should.equal(siteSaveRes.body._id);
                (siteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sites if not signed in', function (done) {
    // Create new Site model instance
    var siteObj = new Site(site);

    // Save the site
    siteObj.save(function () {
      // Request Sites
      request(app).get('/api/sites')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Site if not signed in', function (done) {
    // Create new Site model instance
    var siteObj = new Site(site);

    // Save the Site
    siteObj.save(function () {
      request(app).get('/api/sites/' + siteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', site.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Site with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sites/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Site is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Site which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Site
    request(app).get('/api/sites/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Site with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Site if signed in', function (done) {
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

        // Save a new Site
        agent.post('/api/sites')
          .send(site)
          .expect(200)
          .end(function (siteSaveErr, siteSaveRes) {
            // Handle Site save error
            if (siteSaveErr) {
              return done(siteSaveErr);
            }

            // Delete an existing Site
            agent.delete('/api/sites/' + siteSaveRes.body._id)
              .send(site)
              .expect(200)
              .end(function (siteDeleteErr, siteDeleteRes) {
                // Handle site error error
                if (siteDeleteErr) {
                  return done(siteDeleteErr);
                }

                // Set assertions
                (siteDeleteRes.body._id).should.equal(siteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Site if not signed in', function (done) {
    // Set Site user
    site.user = user;

    // Create new Site model instance
    var siteObj = new Site(site);

    // Save the Site
    siteObj.save(function () {
      // Try deleting Site
      request(app).delete('/api/sites/' + siteObj._id)
        .expect(403)
        .end(function (siteDeleteErr, siteDeleteRes) {
          // Set message assertion
          (siteDeleteRes.body.message).should.match('User is not authorized');

          // Handle Site error error
          done(siteDeleteErr);
        });

    });
  });

  it('should be able to get a single Site that has an orphaned user reference', function (done) {
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

          // Save a new Site
          agent.post('/api/sites')
            .send(site)
            .expect(200)
            .end(function (siteSaveErr, siteSaveRes) {
              // Handle Site save error
              if (siteSaveErr) {
                return done(siteSaveErr);
              }

              // Set assertions on new Site
              (siteSaveRes.body.name).should.equal(site.name);
              should.exist(siteSaveRes.body.user);
              should.equal(siteSaveRes.body.user._id, orphanId);

              // force the Site to have an orphaned user reference
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

                    // Get the Site
                    agent.get('/api/sites/' + siteSaveRes.body._id)
                      .expect(200)
                      .end(function (siteInfoErr, siteInfoRes) {
                        // Handle Site error
                        if (siteInfoErr) {
                          return done(siteInfoErr);
                        }

                        // Set assertions
                        (siteInfoRes.body._id).should.equal(siteSaveRes.body._id);
                        (siteInfoRes.body.name).should.equal(site.name);
                        should.equal(siteInfoRes.body.user, undefined);

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
      Site.remove().exec(done);
    });
  });
});
