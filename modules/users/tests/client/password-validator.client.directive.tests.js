'use strict';

(function() {
  // Password Validator Directive Spec
  describe('PasswordValidatorDirective', function() {
    // Initialize global variables
    var scope,
      element,
      $compile,
      form;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function(_$rootScope_, _$compile_) {
      // Set a new global scope
      scope = _$rootScope_.$new();
      $compile = _$compile_;

      scope.passwordMock = {
        password: 'P@ssw0rd!!'
      };
    }));

    function compileDirective(template) {
      // function to compile a fresh directive with the given template, or a default one
      // input form with directive
      if (!template) template = '<input type="password" id="password" name="password" ng-model="passwordMock.password" password-validator required>';
      template = '<form name="form"><div>' + template + '<input type="submit">submit form</input></div></form>';

      // inject allows you to use AngularJS dependency injection
      // to retrieve and use other services
      inject(function($compile) {
        var form = $compile(template)(scope);
        element = form.find('div');

        // $digest is necessary to finalize the directive generation
        scope.$digest();
      });
    }

    describe('Inicializar', function() {
      beforeEach(function () {
        compileDirective();
      });

      it('deve produzir a entrada de senha', function () {
        expect(element.find('input').length).toEqual(2);
      });

      it('deve verificar a validade do formulário depois de inicializá-lo', function () {
        expect(scope.form.$valid).toBeTruthy();
      });

    });

    it('deve definir formulário como inválido com senha em branco', function () {
      scope.passwordMock.password = '';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeTruthy();
      expect(scope.requirementsColor).toEqual(undefined);
      expect(scope.requirementsProgress).toEqual(undefined);
    });

    it('devem ser válidos quando a senha atende aos requisitos - "P@ssw0rd!!""', function() {
      scope.passwordMock.password = 'P@ssw0rd!!';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeTruthy();
      expect(scope.form.password.$error).toEqual({});
      expect(scope.requirementsColor).toEqual('success');
      expect(scope.requirementsProgress).toEqual('100');
    });

    it('devem ser válidos quando a senha atende aos requisitos com uma senha', function() {
      scope.passwordMock.password = 'Open-Source Full-Stack Solution for MEAN';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeTruthy();
      expect(scope.form.password.$error).toEqual({});
      expect(scope.requirementsColor).toEqual('success');
      expect(scope.requirementsProgress).toEqual('100');
    });

    it('não deve permitir senha com menos de 10 caracteres - "P@$$w0rd!"', function() {
      scope.passwordMock.password = 'P@$$w0rd!';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeFalsy();
      expect(scope.passwordErrors).toEqual(['A senha deve ter pelo menos 10 caracteres.']);
      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('não deve permitir senha com valor maior do que 128 caracteres', function() {
      scope.passwordMock.password = ')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeFalsy();
      expect(scope.passwordErrors).toEqual(['A senha deve ter menos de 128 caracteres.']);
      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('não deve permitir senha com sequências de 3 ou mais caracteres repetidos - "P@$$w0rd!!!"', function() {
      scope.passwordMock.password = 'P@$$w0rd!!!';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeFalsy();
      expect(scope.passwordErrors).toEqual(['A senha não pode conter sequências de três ou mais caracteres repetidos.']);
      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('não deve permitir uma senha sem letras maiúsculas - "p@$$w0rd!!"', function() {
      scope.passwordMock.password = 'p@$$w0rd!!';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeFalsy();
      expect(scope.passwordErrors).toEqual(['A senha deve conter pelo menos uma letra maiúscula.']);
      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('não deve permitir uma senha com menos de um número - "P@$$word!!"', function() {
      scope.passwordMock.password = 'P@$$word!!';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeFalsy();
      expect(scope.passwordErrors).toEqual(['A senha deve conter pelo menos um número.']);
      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('não deve permitir uma senha com menos de um carácter especial - "Passw0rdss"', function() {
      scope.passwordMock.password = 'Passw0rdss';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeFalsy();
      expect(scope.passwordErrors).toEqual(['A senha deve conter pelo menos um caractere especial.']);
      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('deve mostrar 20% progresso e cor "danger"', function() {
      scope.passwordMock.password = 'P';
      compileDirective();
      scope.$digest();

      expect(scope.requirementsColor).toEqual('danger');
      expect(scope.requirementsProgress).toEqual('20');
    });

    it('deve mostrar 40% progresso e cor "warning"', function() {
      scope.passwordMock.password = 'Pa';
      compileDirective();
      scope.$digest();

      expect(scope.requirementsColor).toEqual('warning');
      expect(scope.requirementsProgress).toEqual('40');
    });

    it('deve mostrar 60% progresso e cor "info"', function() {
      scope.passwordMock.password = 'Pa$';
      compileDirective();
      scope.$digest();

      expect(scope.requirementsColor).toEqual('info');
      expect(scope.requirementsProgress).toEqual('60');
    });

    it('deve mostrar 80% progresso e cor "primary"', function() {
      scope.passwordMock.password = 'Pa$$w0rd';
      compileDirective();
      scope.$digest();

      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('deve mostrar100% progresso e cor "success"', function() {
      scope.passwordMock.password = 'Pa$$w0rd!!';
      compileDirective();
      scope.$digest();

      expect(scope.requirementsColor).toEqual('success');
      expect(scope.requirementsProgress).toEqual('100');
    });

  });
}());
