'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * Globals
 */
var user1,
  user2,
  user3;

/**
 * Unit tests
 */
describe('Testes model User:', function () {

  before(function () {
    user1 = {
      nome: 'Full',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3',
      provider: 'local'
    };
    // user2 is a clone of user1
    user2 = user1;
    user3 = {
      nome: 'Different',
      displayName: 'Full Different Name',
      email: 'test3@test.com',
      username: 'different_username',
      password: 'Different_Password1!',
      provider: 'local'
    };
  });

  describe('Método Save', function () {
    it('deve começar sem nenhum usuário', function (done) {
      User.find({}, function (err, users) {
        users.should.have.length(0);
        done();
      });
    });

    it('deve ser capaz de salvar sem problemas', function (done) {
      var _user1 = new User(user1);

      _user1.save(function (err) {
        should.not.exist(err);
        _user1.remove(function (err) {
          should.not.exist(err);
          done();
        });
      });
    });

    it('não deve salvar um usuário existente novamente', function (done) {
      var _user1 = new User(user1);
      var _user2 = new User(user2);

      _user1.save(function () {
        _user2.save(function (err) {
          should.exist(err);
          _user1.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('deve ser capaz de mostrar um erro ao tentar salvar sem o nome', function (done) {
      var _user1 = new User(user1);

      _user1.nome = '';
      _user1.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('deve ser capaz de atualizar um usuário existente com roles válidas , sem problemas', function (done) {
      var _user1 = new User(user1);

      _user1.save(function (err) {
        should.not.exist(err);
        _user1.roles = ['user', 'admin'];
        _user1.save(function (err) {
          should.not.exist(err);
          _user1.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('deve ser capaz de mostrar um erro ao tentar atualizar um usuário existente , sem uma role', function (done) {
      var _user1 = new User(user1);

      _user1.save(function (err) {
        should.not.exist(err);
        _user1.roles = [];
        _user1.save(function (err) {
          should.exist(err);
          _user1.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('deve ser capaz de mostrar um erro ao tentar atualizar um usuário existente com uma role inválida', function (done) {
      var _user1 = new User(user1);

      _user1.save(function (err) {
        should.not.exist(err);
        _user1.roles = ['invalid-user-role-enum'];
        _user1.save(function (err) {
          should.exist(err);
          _user1.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('deve confirmar que alterar o model do usuário não altera a senha', function (done) {
      var _user1 = new User(user1);

      _user1.save(function (err) {
        should.not.exist(err);
        var passwordBefore = _user1.password;
        _user1.nome = 'test';
        _user1.save(function (err) {
          var passwordAfter = _user1.password;
          passwordBefore.should.equal(passwordAfter);
          _user1.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('deve ser capaz de salvar 2 usuários diferentes', function (done) {
      var _user1 = new User(user1);
      var _user3 = new User(user3);

      _user1.save(function (err) {
        should.not.exist(err);
        _user3.save(function (err) {
          should.not.exist(err);
          _user3.remove(function (err) {
            should.not.exist(err);
            _user1.remove(function (err) {
              should.not.exist(err);
              done();
            });
          });
        });
      });
    });

    it('não deve ser capaz de salvar outro usuário com o mesmo endereço de e-mail', function (done) {
      // Test may take some time to complete due to db operations
      this.timeout(10000);

      var _user1 = new User(user1);
      var _user3 = new User(user3);

      _user1.save(function (err) {
        should.not.exist(err);
        _user3.email = _user1.email;
        _user3.save(function (err) {
          should.exist(err);
          _user1.remove(function(err) {
            should.not.exist(err);
            done();
          });
        });
      });

    });

    it('não deve ter índice faltando no campo email, portanto, não impor o modelo\'s índice único', function (done) {
      var _user1 = new User(user1);
      _user1.email = undefined;

      var _user3 = new User(user3);
      _user3.email = undefined;

      _user1.save(function (err) {
        should.not.exist(err);
        _user3.save(function (err) {
          should.not.exist(err);
          _user3.remove(function (err) {
            should.not.exist(err);
            _user1.remove(function (err) {
              should.not.exist(err);
              done();
            });
          });
        });
      });

    });

    it('não deve salvar a senha em formato de texto', function (done) {
      var _user1 = new User(user1);
      var passwordBeforeSave = _user1.password;
      _user1.save(function (err) {
        should.not.exist(err);
        _user1.password.should.not.equal(passwordBeforeSave);
        _user1.remove(function(err) {
          should.not.exist(err);
          done();
        });
      });
    });

    it('não deve salvar a senha em formato de texto', function (done) {
      var _user1 = new User(user1);
      _user1.password = 'Open-Source Full-Stack Solution for MEAN';
      var passwordBeforeSave = _user1.password;
      _user1.save(function (err) {
        should.not.exist(err);
        _user1.password.should.not.equal(passwordBeforeSave);
        _user1.remove(function(err) {
          should.not.exist(err);
          done();
        });
      });
    });
  });

  describe('Testes de validação de senha User', function() {
    it('deve validar quando a força da senha passa - "P@$$w0rd!!"', function () {
      var _user1 = new User(user1);
      _user1.password = 'P@$$w0rd!!';

      _user1.validate(function (err) {
        should.not.exist(err);
      });
    });

    it('deve validar uma senha gerada aleatoriamente a partir do método de esquema estática', function () {
      var _user1 = new User(user1);

      User.generateRandomPassphrase()
      .then(function (password) {
        _user1.password = password;
        _user1.validate(function (err) {
          should.not.exist(err);
        });
      })
      .catch(function (err) {
        should.not.exist(err);
      });

    });

    it('deve validar quando a senha é indefinido', function () {
      var _user1 = new User(user1);
      _user1.password = undefined;

      _user1.validate(function (err) {
        should.not.exist(err);
      });
    });

    it('deve validar quando a força senha passa - "Open-Source Full-Stack Solution For MEAN Applications"', function () {
      var _user1 = new User(user1);
      _user1.password = 'Open-Source Full-Stack Solution For MEAN Applications';

      _user1.validate(function (err) {
        should.not.exist(err);
      });
    });

    it('não deve permitir uma senha com menos de 10 caracteres - "P@$$w0rd!"', function (done) {
      var _user1 = new User(user1);
      _user1.password = 'P@$$w0rd!';

      _user1.validate(function (err) {
        err.errors.password.message.should.equal('A senha deve ter pelo menos 10 caracteres.');
        done();
      });
    });

    it('não deve permitir uma senha maior do que 128 caracteres.', function (done) {
      var _user1 = new User(user1);
      _user1.password = ')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+';

      _user1.validate(function (err) {
        err.errors.password.message.should.equal('A senha deve ter menos de 128 caracteres.');
        done();
      });
    });

    it('não deve permitir uma senha com 3 ou mais caracteres repetidos - "P@$$w0rd!!!"', function (done) {
      var _user1 = new User(user1);
      _user1.password = 'P@$$w0rd!!!';

      _user1.validate(function (err) {
        err.errors.password.message.should.equal('A senha não pode conter sequências de três ou mais caracteres repetidos.');
        done();
      });
    });

    it('não deve permitir uma senha sem letras maiúsculas - "p@$$w0rd!!"', function (done) {
      var _user1 = new User(user1);
      _user1.password = 'p@$$w0rd!!';

      _user1.validate(function (err) {
        err.errors.password.message.should.equal('A senha deve conter pelo menos uma letra maiúscula.');
        done();
      });
    });

    it('não deve permitir uma senha com menos de um número - "P@$$word!!"', function (done) {
      var _user1 = new User(user1);
      _user1.password = 'P@$$word!!';

      _user1.validate(function (err) {
        err.errors.password.message.should.equal('A senha deve conter pelo menos um número.');
        done();
      });
    });

    it('não deve permitir uma senha com menos de um carácter especial - "Passw0rdss"', function (done) {
      var _user1 = new User(user1);
      _user1.password = 'Passw0rdss';

      _user1.validate(function (err) {
        err.errors.password.message.should.equal('A senha deve conter pelo menos um caractere especial.');
        done();
      });
    });
  });

  describe('Testes de validação de e-mail User', function() {
    it('não deve permitir o endereço de e-mail inválido - "123"', function (done) {
      var _user1 = new User(user1);

      _user1.email = '123';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });

    });

    it('não deve permitir o endereço de e-mail inválido - "123@123@123"', function (done) {
      var _user1 = new User(user1);

      _user1.email = '123@123@123';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });

    });

    it('deve permitir o endereço de e-mail - "123@123"', function (done) {
      var _user1 = new User(user1);

      _user1.email = '123@123';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
            should.not.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.not.exist(err);
          done();
        }
      });

    });

    it('não deve permitir o endereço de e-mail inválido - "123.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = '123.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });

    });

    it('não deve permitir o endereço de e-mail inválido - "@123.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = '@123.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
    });

    it('não deve permitir o endereço de e-mail inválido - "abc@abc@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc@abc@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
    });

    it('não deve não deve permitir caracteres inválidos no e-mail- "abc~@#$%^&*()ef=@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc~@#$%^&*()ef=@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
    });

    it('não deve permitir espaços no endereço de e-mail - "abc def@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc def@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
    });

    it('não deve permitir caracteres como aspas duplas no endereço de e-mail - "abc\"def@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc\"def@abc.com';
      _user1.save(function (err) {
        if (err) {
          _user1.remove(function (err_remove) {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
    });

    it('não deve permitir caracteres como dois pontos seguidos no endereço de e-mail - "abcdef@abc..com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abcdef@abc..com';
      _user1.save(function (err) {
        if (err) {
          _user1.remove(function (err_remove) {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
    });

    it('deve permitir os caracteres como aspas simples no endereço de e-mail - "abc\'def@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc\'def@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
            should.not.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.not.exist(err);
          done();
        }
      });
    });

    it('deve permitir os caracteres como aspas simples no endereço de e-mail - "abc@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
            should.not.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.not.exist(err);
          done();
        }
      });
    });

    it('deve permitir e-mail válido - "abc+def@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc+def@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
            should.not.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.not.exist(err);
          done();
        }
      });
    });

    it('deve permitir e-mail válido - "abc.def@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc.def@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
            should.not.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.not.exist(err);
          done();
        }
      });
    });

    it('deve permitir e-mail válido - "abc.def@abc.def.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc.def@abc.def.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
            should.not.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.not.exist(err);
          done();
        }
      });
    });

    it('deve permitir e-mail válido - "abc-def@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc-def@abc.com';
      _user1.save(function (err) {
        should.not.exist(err);
        if (!err) {
          _user1.remove(function (err_remove) {
            should.not.exist(err_remove);
            done();
          });
        } else {
          done();
        }
      });
    });

  });

  after(function (done) {
    User.remove().exec(done);
  });
});
