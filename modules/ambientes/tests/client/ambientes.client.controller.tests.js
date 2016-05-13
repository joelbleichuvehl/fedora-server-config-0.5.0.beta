(function () {
  'use strict';

  describe('Ambientes Controller Tests', function () {
    // Initialize global variables
    var AmbientesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      AmbientesService,
      mockAmbiente;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
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

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _AmbientesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      AmbientesService = _AmbientesService_;

      // create mock Ambiente
      mockAmbiente = new AmbientesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Ambiente Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Ambientes controller.
      AmbientesController = $controller('AmbientesController as vm', {
        $scope: $scope,
        ambienteResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleAmbientePostData;

      beforeEach(function () {
        // Create a sample Ambiente object
        sampleAmbientePostData = new AmbientesService({
          name: 'Ambiente Name'
        });

        $scope.vm.ambiente = sampleAmbientePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (AmbientesService) {
        // Set POST response
        $httpBackend.expectPOST('api/ambientes', sampleAmbientePostData).respond(mockAmbiente);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Ambiente was created
        expect($state.go).toHaveBeenCalledWith('ambientes.view', {
          ambienteId: mockAmbiente._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/ambientes', sampleAmbientePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Ambiente in $scope
        $scope.vm.ambiente = mockAmbiente;
      });

      it('should update a valid Ambiente', inject(function (AmbientesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/ambientes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('ambientes.view', {
          ambienteId: mockAmbiente._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (AmbientesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/ambientes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Ambientes
        $scope.vm.ambiente = mockAmbiente;
      });

      it('should delete the Ambiente and redirect to Ambientes', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/ambientes\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('ambientes.list');
      });

      it('should should not delete the Ambiente and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
