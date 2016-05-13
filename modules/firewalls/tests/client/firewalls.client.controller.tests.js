(function () {
  'use strict';

  describe('Firewalls Controller Tests', function () {
    // Initialize global variables
    var FirewallsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      FirewallsService,
      mockFirewall;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _FirewallsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      FirewallsService = _FirewallsService_;

      // create mock Firewall
      mockFirewall = new FirewallsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Firewall Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Firewalls controller.
      FirewallsController = $controller('FirewallsController as vm', {
        $scope: $scope,
        firewallResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleFirewallPostData;

      beforeEach(function () {
        // Create a sample Firewall object
        sampleFirewallPostData = new FirewallsService({
          name: 'Firewall Name'
        });

        $scope.vm.firewall = sampleFirewallPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (FirewallsService) {
        // Set POST response
        $httpBackend.expectPOST('api/firewalls', sampleFirewallPostData).respond(mockFirewall);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Firewall was created
        expect($state.go).toHaveBeenCalledWith('firewalls.view', {
          firewallId: mockFirewall._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/firewalls', sampleFirewallPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Firewall in $scope
        $scope.vm.firewall = mockFirewall;
      });

      it('should update a valid Firewall', inject(function (FirewallsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/firewalls\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('firewalls.view', {
          firewallId: mockFirewall._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (FirewallsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/firewalls\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Firewalls
        $scope.vm.firewall = mockFirewall;
      });

      it('should delete the Firewall and redirect to Firewalls', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/firewalls\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('firewalls.list');
      });

      it('should should not delete the Firewall and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
