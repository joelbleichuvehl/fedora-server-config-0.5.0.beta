(function () {
  'use strict';

  describe('Testes de usuários rota de Admin', function () {
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

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.users');
        }));

        it('Deve ter a URL correta', function () {
          expect(mainstate.url).toEqual('/users');
        });

        it('não deve ser abstrato', function () {
          expect(mainstate.abstract).toBe(undefined);
        });

        it('Deve ter templateUrl', function () {
          expect(mainstate.templateUrl).toBe('modules/users/client/views/admin/list-users.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate;
        beforeEach(inject(function ($state) {
          viewstate = $state.get('admin.user');
        }));

        it('Deve ter a URL correta', function () {
          expect(viewstate.url).toEqual('/users/:userId');
        });

        it('não deve ser abstrato', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Deve ter templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/users/client/views/admin/view-user.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate;
        beforeEach(inject(function ($state) {
          editstate = $state.get('admin.user-edit');
        }));

        it('deve ter a URL correta', function () {
          expect(editstate.url).toEqual('/users/:userId/edit');
        });

        it('não dever ser abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('deve ter templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/users/client/views/admin/edit-user.client.view.html');
        });
      });

      describe('Barra de Menu', function () {
        beforeEach(inject(function ($state, $rootScope, _Authentication_) {
          Authentication.user = {
            name: 'user',
            roles: ['admin']
          };

          $state.go('admin.users');
          $rootScope.$digest();
        }));

        it('deve remover a barra final', inject(function ($state, $location, $rootScope) {
          $location.path('admin/users/');
          $rootScope.$digest();

          expect($location.path()).toBe('/admin/users');
          expect($state.current.templateUrl).toBe('modules/users/client/views/admin/list-users.client.view.html');
        }));
      });

    });
  });
}());
