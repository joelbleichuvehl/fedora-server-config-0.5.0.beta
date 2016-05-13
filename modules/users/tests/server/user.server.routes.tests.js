'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  _user,
  admin;

/**
 * User routes tests
 */
describe('Testes CRUD User', function () {

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
    _user = {
      nome: 'Full',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    };

    user = new User(_user);

    // Save a user to the test db and create new article
    user.save(function (err) {
      should.not.exist(err);
      done();
    });
  });

  it('deve ser capaz de registrar um novo usuário', function (done) {

    _user.username = 'register_new_user';
    _user.email = 'register_new_user_@test.com';

    agent.post('/api/auth/signup')
      .send(_user)
      .expect(200)
      .end(function (signupErr, signupRes) {
        // Handle signpu error
        if (signupErr) {
          return done(signupErr);
        }

        signupRes.body.username.should.equal(_user.username);
        signupRes.body.email.should.equal(_user.email);
        // Assert a proper profile image has been set, even if by default
        signupRes.body.profileImageURL.should.not.be.empty();
        // Assert we have just the default 'user' role
        signupRes.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
        signupRes.body.roles.indexOf('user').should.equal(0);
        return done();
      });
  });

  it('deve ser capaz de iniciar sessão com êxito e sair com êxito', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Logout
        agent.get('/api/auth/signout')
          .expect(302)
          .end(function (signoutErr, signoutRes) {
            if (signoutErr) {
              return done(signoutErr);
            }

            signoutRes.redirect.should.equal(true);

            // NodeJS v4 changed the status code representation so we must check
            // before asserting, to be comptabile with all node versions.
            if (process.version.indexOf('v4') === 0 || process.version.indexOf('v5') === 0) {
              signoutRes.text.should.equal('Found. Redirecting to /');
            } else {
              signoutRes.text.should.equal('Movido temporariamente. Redirecionando para /');
            }

            return done();
          });
      });
  });

  it('não deve ser capaz de recuperar uma lista de usuários se usuário não for admin', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Request list of users
        agent.get('/api/users')
          .expect(403)
          .end(function (usersGetErr, usersGetRes) {
            if (usersGetErr) {
              return done(usersGetErr);
            }

            return done();
          });
      });
  });

  it('não deve ser capaz de recuperar uma lista de usuários se usuário não for admin', function (done) {
    user.roles = ['root', 'user', 'admin'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Request list of users
          agent.get('/api/users')
            .expect(200)
            .end(function (usersGetErr, usersGetRes) {
              if (usersGetErr) {
                return done(usersGetErr);
              }

              usersGetRes.body.should.be.instanceof(Array).and.have.lengthOf(1);

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('deve ser capaz de obter detalhes de um único usuário se for admin', function (done) {
    user.roles = ['root', 'user', 'admin'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get single user information from the database
          agent.get('/api/users/' + user._id)
            .expect(200)
            .end(function (userInfoErr, userInfoRes) {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              userInfoRes.body.should.be.instanceof(Object);
              userInfoRes.body._id.should.be.equal(String(user._id));

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('deve ser capaz de atualizar um usuário se for admin', function (done) {
    user.roles = ['root', 'user', 'admin'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get single user information from the database

          var userUpdate = {
            nome: 'admin_update_first',
            roles: ['admin']
          };

          agent.put('/api/users/' + user._id)
            .send(userUpdate)
            .expect(200)
            .end(function (userInfoErr, userInfoRes) {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              userInfoRes.body.should.be.instanceof(Object);
              userInfoRes.body.nome.should.be.equal('admin_update_first');
              userInfoRes.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
              userInfoRes.body._id.should.be.equal(String(user._id));

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('deve ser capaz de excluir um usuário se for admin', function (done) {
    user.roles = ['root', 'user', 'admin'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          agent.delete('/api/users/' + user._id)
            // .send(userUpdate)
            .expect(200)
            .end(function (userInfoErr, userInfoRes) {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              userInfoRes.body.should.be.instanceof(Object);
              userInfoRes.body._id.should.be.equal(String(user._id));

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('esqueceu a senha, deve retornar 400 para nome de usuário inexistente', function (done) {
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          username: 'some_username_that_doesnt_exist'
        })
        .expect(400)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          res.body.message.should.equal('Nenhuma conta foi encontrada para este usuário!');
          return done();
        });
    });
  });

  it('esqueceu a senha, deve retornar erro 400 para o usuário fornecido', function (done) {
    var provider = 'facebook';
    user.provider = provider;
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          username: ''
        })
        .expect(400)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          res.body.message.should.equal('Campo nome de usuário não deve estar em branco!');
          return done();
        });
    });
  });

  it('esqueceu a senha, deve retornar erro 400 do provedor não-local para o usuário', function (done) {
    var provider = 'facebook';
    user.provider = provider;
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          username: user.username
        })
        .expect(400)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          res.body.message.should.equal('Parece que você se inscreveu usando a sua conta ' + user.provider);
          return done();
        });
    });
  });

  it('esqueceu a senha, deve ser capaz de redefinir a senha para o usuário de solicitação de redefinição de senha', function (done) {
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          username: user.username
        })
        .expect(400)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          User.findOne({ username: user.username.toLowerCase() }, function(err, userRes) {
            userRes.resetPasswordToken.should.not.be.empty();
            should.exist(userRes.resetPasswordExpires);
            res.body.message.should.be.equal('Failure sending email');
            return done();
          });
        });
    });
  });

  it('esqueceu a senha deve ser capaz de redefinir a senha usando o token de redefinição', function (done) {
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          username: user.username
        })
        .expect(400)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          User.findOne({ username: user.username.toLowerCase() }, function(err, userRes) {
            userRes.resetPasswordToken.should.not.be.empty();
            should.exist(userRes.resetPasswordExpires);

            agent.get('/api/auth/reset/' + userRes.resetPasswordToken)
            .expect(302)
            .end(function (err, res) {
              // Handle error
              if (err) {
                return done(err);
              }

              res.headers.location.should.be.equal('/password/reset/' + userRes.resetPasswordToken);

              return done();
            });
          });
        });
    });
  });

  it('esqueceu a senha deve retornar erro ao usar token de redefinição inválida', function (done) {
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          username: user.username
        })
        .expect(400)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          var invalidToken = 'someTOKEN1234567890';
          agent.get('/api/auth/reset/' + invalidToken)
          .expect(302)
          .end(function (err, res) {
            // Handle error
            if (err) {
              return done(err);
            }

            res.headers.location.should.be.equal('/password/reset/invalid');

            return done();
          });
        });
    });
  });

  it('deve ser capaz de alterar a senha do próprio usuário com sucesso', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Change password
        agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890Aa$',
            currentPassword: credentials.password
          })
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            res.body.message.should.equal('Senha alterada com sucesso!');
            return done();
          });
      });
  });

  it('não deve ser capaz de alterar usuários de as senhas dadas não conferem', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Change password
        agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890-ABC-123-Aa$',
            currentPassword: credentials.password
          })
          .expect(400)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            res.body.message.should.equal('As senhas não conferem!');
            return done();
          });
      });
  });

  it('não deve ser capaz de alterar usuários de as senhas dadas não conferem', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Change password
        agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890Aa$',
            currentPassword: 'some_wrong_passwordAa$'
          })
          .expect(400)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            res.body.message.should.equal('A senha atual está incorreta!');
            return done();
          });
      });
  });

  it('não deve ser capaz de alterar o usuário se nenhuma nova senha é dada', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Change password
        agent.post('/api/users/password')
          .send({
            newPassword: '',
            verifyPassword: '',
            currentPassword: credentials.password
          })
          .expect(400)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            res.body.message.should.equal('Por favor, forneça uma nova senha!');
            return done();
          });
      });
  });

  it('não deve ser capaz de alterar o usuário se nenhuma nova senha é dada', function (done) {

    // Change password
    agent.post('/api/users/password')
      .send({
        newPassword: '1234567890Aa$',
        verifyPassword: '1234567890Aa$',
        currentPassword: credentials.password
      })
      .expect(400)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }

        res.body.message.should.equal('O usuário não está conectado!');
        return done();
      });
  });

  it('deve ser capaz de obter detalhes de seu próprio usuário com sucesso', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get own user details
        agent.get('/api/users/me')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            res.body.should.be.instanceof(Object);
            res.body.username.should.equal(user.username);
            res.body.email.should.equal(user.email);
            should.not.exist(res.body.salt);
            should.not.exist(res.body.password);
            return done();
          });
      });
  });

  it('não deve ser capaz de obter detalhes do usuário se não estiver logado', function (done) {
    // Get own user details
    agent.get('/api/users/me')
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }

        should.not.exist(res.body);
        return done();
      });
  });

  it('deve ser capaz de atualizar próprios detalhes de usuário', function (done) {
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          var userUpdate = {
            nome: 'user_update_first'
          };

          agent.put('/api/users')
            .send(userUpdate)
            .expect(200)
            .end(function (userInfoErr, userInfoRes) {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              userInfoRes.body.should.be.instanceof(Object);
              userInfoRes.body.nome.should.be.equal('user_update_first');
              userInfoRes.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
              userInfoRes.body.roles.indexOf('user').should.equal(0);
              userInfoRes.body._id.should.be.equal(String(user._id));

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('não deve ser capaz de atualizar seus próprios detalhes de usuário e adicionar funções se não for admin', function (done) {
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          var userUpdate = {
            nome: 'user_update_first',
            roles: ['user', 'admin']
          };

          agent.put('/api/users')
            .send(userUpdate)
            .expect(200)
            .end(function (userInfoErr, userInfoRes) {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              userInfoRes.body.should.be.instanceof(Object);
              userInfoRes.body.nome.should.be.equal('user_update_first');
              userInfoRes.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
              userInfoRes.body.roles.indexOf('user').should.equal(0);
              userInfoRes.body._id.should.be.equal(String(user._id));

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('não deve ser capaz de atualizar próprios detalhes do usuário com nome de usuário existente', function (done) {

    var _user2 = _user;

    _user2.username = 'user2_username';
    _user2.email = 'user2_email@test.com';

    var credentials2 = {
      username: 'username2',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    _user2.username = credentials2.username;
    _user2.password = credentials2.password;

    var user2 = new User(_user2);

    user2.save(function (err) {
      should.not.exist(err);

      agent.post('/api/auth/signin')
        .send(credentials2)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          var userUpdate = {
            nome: 'user_update_first',
            username: user.username
          };

          agent.put('/api/users')
            .send(userUpdate)
            .expect(400)
            .end(function (userInfoErr, userInfoRes) {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              // Call the assertion callback
              userInfoRes.body.message.should.equal('Username already exists');

              return done();
            });
        });
    });
  });

  it('não deve ser capaz de atualizar próprios detalhes de usuários com e-mail existentes', function (done) {

    var _user2 = _user;

    _user2.username = 'user2_username';
    _user2.email = 'user2_email@test.com';

    var credentials2 = {
      username: 'username2',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    _user2.username = credentials2.username;
    _user2.password = credentials2.password;

    var user2 = new User(_user2);

    user2.save(function (err) {
      should.not.exist(err);

      agent.post('/api/auth/signin')
        .send(credentials2)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          var userUpdate = {
            nome: 'user_update_first',
            email: user.email
          };

          agent.put('/api/users')
            .send(userUpdate)
            .expect(400)
            .end(function (userInfoErr, userInfoRes) {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              // Call the assertion callback
              userInfoRes.body.message.should.equal('Email already exists');// nao pode ser traduzido

              return done();
            });
        });
    });
  });

  it('não deve ser capaz de atualizar próprios detalhes de usuário se não estiver logado', function (done) {
    user.roles = ['user'];

    user.save(function (err) {

      should.not.exist(err);

      var userUpdate = {
        nome: 'user_update_first'
      };

      agent.put('/api/users')
        .send(userUpdate)
        .expect(400)
        .end(function (userInfoErr, userInfoRes) {
          if (userInfoErr) {
            return done(userInfoErr);
          }

          userInfoRes.body.message.should.equal('Usuário não está logado!');

          // Call the assertion callback
          return done();
        });
    });
  });

  it('não deve ser capaz de atualizar imagem do próprio perfil de utilizador sem estar logado', function (done) {

    agent.post('/api/users/picture')
      .send({})
      .expect(400)
      .end(function (userInfoErr, userInfoRes) {
        if (userInfoErr) {
          return done(userInfoErr);
        }

        userInfoRes.body.message.should.equal('Usuário não está logado!');

        // Call the assertion callback
        return done();
      });
  });

  it('deve ser capaz de mudar imagem de perfil quando está logado', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/users/picture')
          .attach('newProfilePicture', './modules/users/client/img/profile/default.png')
          .send(credentials)
          .expect(200)
          .end(function (userInfoErr, userInfoRes) {
            // Handle change profile picture error
            if (userInfoErr) {
              return done(userInfoErr);
            }

            userInfoRes.body.should.be.instanceof(Object);
            userInfoRes.body.profileImageURL.should.be.a.String();
            userInfoRes.body._id.should.be.equal(String(user._id));

            return done();
          });
      });
  });

  it('não deve ser capaz de mudar imagem de perfil, se anexar uma imagem com um nome de campo diferente', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/users/picture')
          .attach('fieldThatDoesntWork', './modules/users/client/img/profile/default.png')
          .send(credentials)
          .expect(400)
          .end(function (userInfoErr, userInfoRes) {
            done(userInfoErr);
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(done);
  });
});
