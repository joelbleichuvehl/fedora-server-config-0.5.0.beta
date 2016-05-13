(function () {
  'use strict';

  describe('Testes Rota de Usuários', function () {
    // Initialize global variables
    var $scope,
      Authentication;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _Authentication_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      Authentication = _Authentication_;
    }));

    describe('Configurações Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('settings');
        }));

        it('deve ter a URL correta', function () {
          expect(mainstate.url).toEqual('/settings');
        });

        it('deve ser abstrato', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('deve ter templateUrl', function () {
          expect(mainstate.templateUrl).toBe('modules/users/client/views/settings/settings.client.view.html');
        });
      });

      describe('Rota Perfil', function () {
        var profilestate;
        beforeEach(inject(function ($state) {
          profilestate = $state.get('settings.profile');
        }));

        it('deve ter a URL correta', function () {
          expect(profilestate.url).toEqual('/profile');
        });

        it('não deveria ser abstrata', function () {
          expect(profilestate.abstract).toBe(undefined);
        });

        it('deve ter templateUrl', function () {
          expect(profilestate.templateUrl).toBe('modules/users/client/views/settings/edit-profile.client.view.html');
        });
      });

      describe('Rota Password', function () {
        var passwordstate;
        beforeEach(inject(function ($state) {
          passwordstate = $state.get('settings.password');
        }));

        it('deve ter a URL correta', function () {
          expect(passwordstate.url).toEqual('/password');
        });

        it('não deve ser abstrato', function () {
          expect(passwordstate.abstract).toBe(undefined);
        });

        it('deve ter templateUrl', function () {
          expect(passwordstate.templateUrl).toBe('modules/users/client/views/settings/change-password.client.view.html');
        });
      });

      describe('Rota Accounts', function () {
        var accountsstate;
        beforeEach(inject(function ($state) {
          accountsstate = $state.get('settings.accounts');
        }));

        it('deve conter a URL correta', function () {
          expect(accountsstate.url).toEqual('/accounts');
        });

        it('não deve ser abstrato', function () {
          expect(accountsstate.abstract).toBe(undefined);
        });

        it('deve ter templateUrl', function () {
          expect(accountsstate.templateUrl).toBe('modules/users/client/views/settings/manage-social-accounts.client.view.html');
        });
      });

      describe('Rota Picture', function () {
        var picturestate;
        beforeEach(inject(function ($state) {
          picturestate = $state.get('settings.picture');
        }));

        it('deve ter a URL correta', function () {
          expect(picturestate.url).toEqual('/picture');
        });

        it('não deve ser abstrato', function () {
          expect(picturestate.abstract).toBe(undefined);
        });

        it('deve ter templateUrl', function () {
          expect(picturestate.templateUrl).toBe('modules/users/client/views/settings/change-profile-picture.client.view.html');
        });
      });

      describe('Barra de Menu User', function () {
        beforeEach(inject(function ($state, $rootScope, _Authentication_) {
          Authentication.user = {
            name: 'user',
            roles: ['user']
          };

          $state.go('settings.profile');
          $rootScope.$digest();
        }));

        it('deve remover barra final', inject(function ($state, $location, $rootScope) {
          $location.path('settings/profile/');
          $rootScope.$digest();

          expect($location.path()).toBe('/settings/profile');
          expect($state.current.templateUrl).toBe('modules/users/client/views/settings/edit-profile.client.view.html');
        }));
      });

    });

    describe('Rota Authentication', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('authentication');
        }));

        it('deve ter a URL correta', function () {
          expect(mainstate.url).toEqual('/authentication');
        });

        it('deve ser abstrato', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('deve ter templateUrl', function () {
          expect(mainstate.templateUrl).toBe('modules/users/client/views/authentication/authentication.client.view.html');
        });
      });

      describe('Rora Signup', function () {
        var signupstate;
        beforeEach(inject(function ($state) {
          signupstate = $state.get('authentication.signup');
        }));

        it('deve ter a URL correta', function () {
          expect(signupstate.url).toEqual('/signup');
        });

        it('não deve ser abstrato', function () {
          expect(signupstate.abstract).toBe(undefined);
        });

        it('deve ter templateUrl', function () {
          expect(signupstate.templateUrl).toBe('modules/users/client/views/authentication/signup.client.view.html');
        });
      });

      describe('Rota Signin', function () {
        var signinstate;
        beforeEach(inject(function ($state) {
          signinstate = $state.get('authentication.signin');
        }));

        it('deve ter a URL correta', function () {
          expect(signinstate.url).toEqual('/signin?err');
        });

        it('não deve ser abstrato', function () {
          expect(signinstate.abstract).toBe(undefined);
        });

        it('deve ter templateUrl', function () {
          expect(signinstate.templateUrl).toBe('modules/users/client/views/authentication/signin.client.view.html');
        });
      });

    });

    describe('Rota Password Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('password');
        }));

        it('deve ter a URL correta', function () {
          expect(mainstate.url).toEqual('/password');
        });

        it('deve ser abstrato', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('deve ter template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('Rota Forgot', function () {
        var forgotstate;
        beforeEach(inject(function ($state) {
          forgotstate = $state.get('password.forgot');
        }));

        it('deve conter a URL correta', function () {
          expect(forgotstate.url).toEqual('/forgot');
        });

        it('não pode ser abstrato', function () {
          expect(forgotstate.abstract).toBe(undefined);
        });

        it('deve ter templateUrl', function () {
          expect(forgotstate.templateUrl).toBe('modules/users/client/views/password/forgot-password.client.view.html');
        });
      });

    });

    describe('Rota Password Reset Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('password.reset');
        }));

        it('deve ter a URL correta', function () {
          expect(mainstate.url).toEqual('/reset');
        });

        it('deve ser abstrato', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('deve ter template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('Rota inválida', function () {
        var invalidstate;
        beforeEach(inject(function ($state) {
          invalidstate = $state.get('password.reset.invalid');
        }));

        it('deve ter a URL correta', function () {
          expect(invalidstate.url).toEqual('/invalid');
        });

        it('não deve ser abstrato', function () {
          expect(invalidstate.abstract).toBe(undefined);
        });

        it('deveria templateUrl', function () {
          expect(invalidstate.templateUrl).toBe('modules/users/client/views/password/reset-password-invalid.client.view.html');
        });
      });

      describe('Success Route', function () {
        var successstate;
        beforeEach(inject(function ($state) {
          successstate = $state.get('password.reset.success');
        }));

        it('deve ter a URL correta', function () {
          expect(successstate.url).toEqual('/success');
        });

        it('não deve ser abstrato', function () {
          expect(successstate.abstract).toBe(undefined);
        });

        it('deve ter templateUrl', function () {
          expect(successstate.templateUrl).toBe('modules/users/client/views/password/reset-password-success.client.view.html');
        });
      });

      describe('Form Route', function () {
        var formstate;
        beforeEach(inject(function ($state) {
          formstate = $state.get('password.reset.form');
        }));

        it('deve ter a URL correta', function () {
          expect(formstate.url).toEqual('/:token');
        });

        it('não deve ser abstrato', function () {
          expect(formstate.abstract).toBe(undefined);
        });

        it('deve ter templateUrl', function () {
          expect(formstate.templateUrl).toBe('modules/users/client/views/password/reset-password.client.view.html');
        });
      });

    });
  });
}());
