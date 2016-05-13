(function () {
  'use strict';

  describe('Ambientes Route Tests', function () {
    // Initialize global variables
    var $scope,
      AmbientesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AmbientesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AmbientesService = _AmbientesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('ambientes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/ambientes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AmbientesController,
          mockAmbiente;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('ambientes.view');
          $templateCache.put('modules/ambientes/client/views/view-ambiente.client.view.html', '');

          // create mock Ambiente
          mockAmbiente = new AmbientesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Ambiente Name'
          });

          // Initialize Controller
          AmbientesController = $controller('AmbientesController as vm', {
            $scope: $scope,
            ambienteResolve: mockAmbiente
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:ambienteId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.ambienteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            ambienteId: 1
          })).toEqual('/ambientes/1');
        }));

        it('should attach an Ambiente to the controller scope', function () {
          expect($scope.vm.ambiente._id).toBe(mockAmbiente._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/ambientes/client/views/view-ambiente.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AmbientesController,
          mockAmbiente;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('ambientes.create');
          $templateCache.put('modules/ambientes/client/views/form-ambiente.client.view.html', '');

          // create mock Ambiente
          mockAmbiente = new AmbientesService();

          // Initialize Controller
          AmbientesController = $controller('AmbientesController as vm', {
            $scope: $scope,
            ambienteResolve: mockAmbiente
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.ambienteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/ambientes/create');
        }));

        it('should attach an Ambiente to the controller scope', function () {
          expect($scope.vm.ambiente._id).toBe(mockAmbiente._id);
          expect($scope.vm.ambiente._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/ambientes/client/views/form-ambiente.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AmbientesController,
          mockAmbiente;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('ambientes.edit');
          $templateCache.put('modules/ambientes/client/views/form-ambiente.client.view.html', '');

          // create mock Ambiente
          mockAmbiente = new AmbientesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Ambiente Name'
          });

          // Initialize Controller
          AmbientesController = $controller('AmbientesController as vm', {
            $scope: $scope,
            ambienteResolve: mockAmbiente
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:ambienteId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.ambienteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            ambienteId: 1
          })).toEqual('/ambientes/1/edit');
        }));

        it('should attach an Ambiente to the controller scope', function () {
          expect($scope.vm.ambiente._id).toBe(mockAmbiente._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/ambientes/client/views/form-ambiente.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
