'use strict';

(function () {
  // Authentication controller Spec
  describe('AuthenticationController', function () {
    // Initialize global variables
    var AuthenticationController,
      scope,
      $httpBackend,
      $stateParams,
      $state,
      $location;

    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
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

    describe('usuário desconectado', function () {
      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;

        // Initialize the Authentication controller
        AuthenticationController = $controller('AuthenticationController as vm', {
          $scope: scope
        });
      }));

      describe('$scope.signin()', function () {
        it('deve fazer o login com um usuário e senha corretos', function () {
          // Test expected GET request
          $httpBackend.when('POST', '/api/auth/signin').respond(200, 'Fred');

          scope.vm.signin(true);
          $httpBackend.flush();

          // Test scope value
          expect(scope.vm.authentication.user).toEqual('Fred');
          expect($location.url()).toEqual('/');
        });

        it('deve ser redirecionada para o estado anterior após o login bem-sucedido',
          inject(function (_$state_) {
            $state = _$state_;
            $state.previous = {
              state: {
                name: 'articles.create'
              },
              params: {},
              href: '/articles/create'
            };

            spyOn($state, 'transitionTo');
            spyOn($state, 'go');

            // Test expected GET request
            $httpBackend.when('POST', '/api/auth/signin').respond(200, 'Fred');

            scope.vm.signin(true);
            $httpBackend.flush();

            // Test scope value
            expect($state.go).toHaveBeenCalled();
            expect($state.go).toHaveBeenCalledWith($state.previous.state.name, $state.previous.params);

          }));

        it('deve deixar de entrar com nada', function () {
          // Test expected POST request
          $httpBackend.expectPOST('/api/auth/signin').respond(400, {
            'message': 'Sem credenciais'
          });

          scope.vm.signin(true);
          $httpBackend.flush();

          // Test scope value
          expect(scope.vm.error).toEqual('Sem credenciais');
        });

        it('deve falhar fazer o login com credenciais erradas', function () {
          // Foo/Bar combo assumed to not exist
          scope.vm.authentication.user = 'Foo';
          scope.vm.credentials = 'Bar';

          // Test expected POST request
          $httpBackend.expectPOST('/api/auth/signin').respond(400, {
            'message': 'Usuário desconhecido'
          });

          scope.vm.signin(true);
          $httpBackend.flush();

          // Test scope value
          expect(scope.vm.error).toEqual('Usuário desconhecido');
        });
      });

      describe('$scope.signup()', function () {
        it('deve registrar com dados corretos', function () {
          // Test expected GET request
          scope.vm.authentication.user = 'Fred';
          $httpBackend.when('POST', '/api/auth/signup').respond(200, 'Fred');

          scope.vm.signup(true);
          $httpBackend.flush();

          // test scope value
          expect(scope.vm.authentication.user).toBe('Fred');
          expect(scope.vm.error).toEqual(null);
          expect($location.url()).toBe('/');
        });

        it('não deve registrar com usuário duplicado', function () {
          // Test expected POST request
          $httpBackend.when('POST', '/api/auth/signup').respond(400, {
            'message': 'Nome de usuário já existe'
          });

          scope.vm.signup(true);
          $httpBackend.flush();

          // Test scope value
          expect(scope.vm.error).toBe('Nome de usuário já existe');
        });
      });
    });

    describe('Usuário conectado', function () {
      beforeEach(inject(function ($controller, $rootScope, _$location_, _Authentication_) {
        scope = $rootScope.$new();

        $location = _$location_;
        $location.path = jasmine.createSpy().and.returnValue(true);

        // Mock logged in user
        _Authentication_.user = {
          username: 'test',
          roles: ['user']
        };

        AuthenticationController = $controller('AuthenticationController as vm', {
          $scope: scope
        });
      }));

      it('deve ser redirecionado para home', function () {
        expect($location.path).toHaveBeenCalledWith('/');
      });
    });
  });
}());
