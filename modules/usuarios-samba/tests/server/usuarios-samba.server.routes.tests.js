'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Usuario = mongoose.model('Usuario'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  usuario;

/**
 * Usuario routes tests
 */
describe('Usuario CRUD tests', function () {

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

    // Save a user to the test db and create new Usuario
    user.save(function () {
      usuario = {
        name: 'Usuario name'
      };

      done();
    });
  });

  it('should be able to save a Usuario if logged in', function (done) {
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

        // Save a new Usuario
        agent.post('/api/usuarios')
          .send(usuario)
          .expect(200)
          .end(function (usuarioSaveErr, usuarioSaveRes) {
            // Handle Usuario save error
            if (usuarioSaveErr) {
              return done(usuarioSaveErr);
            }

            // Get a list of Usuarios
            agent.get('/api/usuarios')
              .end(function (usuariosGetErr, usuariosGetRes) {
                // Handle Usuario save error
                if (usuariosGetErr) {
                  return done(usuariosGetErr);
                }

                // Get Usuarios list
                var usuarios = usuariosGetRes.body;

                // Set assertions
                (usuarios[0].user._id).should.equal(userId);
                (usuarios[0].name).should.match('Usuario name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Usuario if not logged in', function (done) {
    agent.post('/api/usuarios')
      .send(usuario)
      .expect(403)
      .end(function (usuarioSaveErr, usuarioSaveRes) {
        // Call the assertion callback
        done(usuarioSaveErr);
      });
  });

  it('should not be able to save an Usuario if no name is provided', function (done) {
    // Invalidate name field
    usuario.name = '';

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

        // Save a new Usuario
        agent.post('/api/usuarios')
          .send(usuario)
          .expect(400)
          .end(function (usuarioSaveErr, usuarioSaveRes) {
            // Set message assertion
            (usuarioSaveRes.body.message).should.match('Please fill Usuario name');

            // Handle Usuario save error
            done(usuarioSaveErr);
          });
      });
  });

  it('should be able to update an Usuario if signed in', function (done) {
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

        // Save a new Usuario
        agent.post('/api/usuarios')
          .send(usuario)
          .expect(200)
          .end(function (usuarioSaveErr, usuarioSaveRes) {
            // Handle Usuario save error
            if (usuarioSaveErr) {
              return done(usuarioSaveErr);
            }

            // Update Usuario name
            usuario.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Usuario
            agent.put('/api/usuarios/' + usuarioSaveRes.body._id)
              .send(usuario)
              .expect(200)
              .end(function (usuarioUpdateErr, usuarioUpdateRes) {
                // Handle Usuario update error
                if (usuarioUpdateErr) {
                  return done(usuarioUpdateErr);
                }

                // Set assertions
                (usuarioUpdateRes.body._id).should.equal(usuarioSaveRes.body._id);
                (usuarioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Usuarios if not signed in', function (done) {
    // Create new Usuario model instance
    var usuarioObj = new Usuario(usuario);

    // Save the usuario
    usuarioObj.save(function () {
      // Request Usuarios
      request(app).get('/api/usuarios')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Usuario if not signed in', function (done) {
    // Create new Usuario model instance
    var usuarioObj = new Usuario(usuario);

    // Save the Usuario
    usuarioObj.save(function () {
      request(app).get('/api/usuarios/' + usuarioObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', usuario.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Usuario with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/usuarios/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Usuario is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Usuario which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Usuario
    request(app).get('/api/usuarios/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Usuario with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Usuario if signed in', function (done) {
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

        // Save a new Usuario
        agent.post('/api/usuarios')
          .send(usuario)
          .expect(200)
          .end(function (usuarioSaveErr, usuarioSaveRes) {
            // Handle Usuario save error
            if (usuarioSaveErr) {
              return done(usuarioSaveErr);
            }

            // Delete an existing Usuario
            agent.delete('/api/usuarios/' + usuarioSaveRes.body._id)
              .send(usuario)
              .expect(200)
              .end(function (usuarioDeleteErr, usuarioDeleteRes) {
                // Handle usuario error error
                if (usuarioDeleteErr) {
                  return done(usuarioDeleteErr);
                }

                // Set assertions
                (usuarioDeleteRes.body._id).should.equal(usuarioSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Usuario if not signed in', function (done) {
    // Set Usuario user
    usuario.user = user;

    // Create new Usuario model instance
    var usuarioObj = new Usuario(usuario);

    // Save the Usuario
    usuarioObj.save(function () {
      // Try deleting Usuario
      request(app).delete('/api/usuarios/' + usuarioObj._id)
        .expect(403)
        .end(function (usuarioDeleteErr, usuarioDeleteRes) {
          // Set message assertion
          (usuarioDeleteRes.body.message).should.match('User is not authorized');

          // Handle Usuario error error
          done(usuarioDeleteErr);
        });

    });
  });

  it('should be able to get a single Usuario that has an orphaned user reference', function (done) {
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

          // Save a new Usuario
          agent.post('/api/usuarios')
            .send(usuario)
            .expect(200)
            .end(function (usuarioSaveErr, usuarioSaveRes) {
              // Handle Usuario save error
              if (usuarioSaveErr) {
                return done(usuarioSaveErr);
              }

              // Set assertions on new Usuario
              (usuarioSaveRes.body.name).should.equal(usuario.name);
              should.exist(usuarioSaveRes.body.user);
              should.equal(usuarioSaveRes.body.user._id, orphanId);

              // force the Usuario to have an orphaned user reference
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

                    // Get the Usuario
                    agent.get('/api/usuarios/' + usuarioSaveRes.body._id)
                      .expect(200)
                      .end(function (usuarioInfoErr, usuarioInfoRes) {
                        // Handle Usuario error
                        if (usuarioInfoErr) {
                          return done(usuarioInfoErr);
                        }

                        // Set assertions
                        (usuarioInfoRes.body._id).should.equal(usuarioSaveRes.body._id);
                        (usuarioInfoRes.body.name).should.equal(usuario.name);
                        should.equal(usuarioInfoRes.body.user, undefined);

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
      Usuario.remove().exec(done);
    });
  });
});
