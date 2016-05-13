'use strict';

(function() {
  // Password controller Spec
  describe('PasswordController', function() {
    // Initialize global variables
    var PasswordController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      $window;

    beforeEach(function() {
      jasmine.addMatchers({
        toEqualData: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    describe('Usuário deslogado', function() {
      beforeEach(inject(function($controller, $rootScope, _Authentication_, _$stateParams_, _$httpBackend_, _$location_) {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        $location.path = jasmine.createSpy().and.returnValue(true);

        // Mock logged in user
        _Authentication_.user = {
          username: 'test',
          roles: ['user']
        };

        // Initialize the Authentication controller
        PasswordController = $controller('PasswordController as vm', {
          $scope: scope
        });
      }));

      it('deve redirecionar usuário logado para home', function() {
        expect($location.path).toHaveBeenCalledWith('/');
      });
    });

    describe('Usuário desconectado', function() {
      beforeEach(inject(function($controller, $rootScope, _$window_, _$stateParams_, _$httpBackend_, _$location_) {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        $location.path = jasmine.createSpy().and.returnValue(true);
        $window = _$window_;
        $window.user = null;

        // Initialize the Authentication controller
        PasswordController = $controller('PasswordController as vm', {
          $scope: scope
        });
      }));

      it('não deve redirecionar para home', function() {
        expect($location.path).not.toHaveBeenCalledWith('/');
      });

      describe('askForPasswordReset', function() {
        var credentials = {
          username: 'test',
          password: 'P@ssw0rd!!'
        };
        beforeEach(function() {
          scope.vm.credentials = credentials;
        });

        it('deve limpar scope.success e scope.error', function() {
          scope.vm.success = 'test';
          scope.vm.error = 'test';
          scope.vm.askForPasswordReset(true);

          expect(scope.vm.success).toBeNull();
          expect(scope.vm.error).toBeNull();
        });

        describe('POST error', function() {
          var errorMessage = 'A conta com esse nome de usuário não foi encontrada';
          beforeEach(function() {
            $httpBackend.when('POST', '/api/auth/forgot', credentials).respond(400, {
              'message': errorMessage
            });

            scope.vm.askForPasswordReset(true);
            $httpBackend.flush();
          });

          it('deve limpar o formulário', function() {
            expect(scope.vm.credentials).toBe(null);
          });

          it('deve definir a mensagem de resposta de erro', function() {
            expect(scope.vm.error).toBe(errorMessage);
          });
        });

        describe('POST success', function() {
          var successMessage = 'Uma mensagem foi enviada para o e-mail fornecido com mais instruções.';
          beforeEach(function() {
            $httpBackend.when('POST', '/api/auth/forgot', credentials).respond({
              'message': successMessage
            });

            scope.vm.askForPasswordReset(true);
            $httpBackend.flush();
          });

          it('should clear form', function() {
            expect(scope.vm.credentials).toBe(null);
          });

          it('deve definir a mensagem de resposta como success', function() {
            expect(scope.vm.success).toBe(successMessage);
          });
        });
      });

      describe('resetUserPassword', function() {
        var token = 'testToken';
        var passwordDetails = {
          password: 'test'
        };
        beforeEach(function() {
          $stateParams.token = token;
          scope.vm.passwordDetails = passwordDetails;
        });

        it('deve limpar scope.success e scope.vm.error', function() {
          scope.vm.success = 'test';
          scope.vm.error = 'test';
          scope.vm.resetUserPassword(true);

          expect(scope.vm.success).toBeNull();
          expect(scope.vm.error).toBeNull();
        });

        it('deve definir como erro de POST a mensagem de resposta', function() {
          var errorMessage = 'As senhas não conferem!';
          $httpBackend.when('POST', '/api/auth/reset/' + token, passwordDetails).respond(400, {
            'message': errorMessage
          });

          scope.vm.resetUserPassword(true);
          $httpBackend.flush();

          expect(scope.vm.error).toBe(errorMessage);
        });

        describe('POST success', function() {
          var user = {
            username: 'test'
          };
          beforeEach(function() {
            $httpBackend.when('POST', '/api/auth/reset/' + token, passwordDetails).respond(user);

            scope.vm.resetUserPassword(true);
            $httpBackend.flush();
          });

          it('deve limpar formulário de senha', function() {
            expect(scope.vm.passwordDetails).toBe(null);
          });

          it('deve anexar perfil de usuário', function() {
            expect(scope.vm.authentication.user).toEqual(user);
          });

          it('deve redirecionar para tela de success quando redefinição de senha for bem sucedida', function() {
            expect($location.path).toHaveBeenCalledWith('/password/reset/success');
          });
        });
      });
    });
  });
}());
