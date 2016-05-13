'use strict';

describe('Teste Users E2E:', function () {
  var user1 = {
    nome: 'test',
    email: 'test.user@meanjs.com',
    username: 'testUser',
    password: 'P@$$w0rd!!'
  };

  var user2 = {
    nome: 'test',
    email: 'test.user2@meanjs.com',
    username: 'testUser2',
    password: 'P@$$w0rd!!'
  };

  var signout = function () {
    // Make sure user is signed out first
    browser.get('http://localhost:3001/authentication/signout');
    // Delete all cookies
    browser.driver.manage().deleteAllCookies();
  };

  describe('Validação Signup', function () {
    it('Deve informar o primeiro nome ausente', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // First Name Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('É necessário informar um Nome.');
    });

    it('Deve informar endereço de e-mail em falta', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.nome')).sendKeys(user1.nome);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('É necessário informar um endereço de E-mail');
    });

    it('Deve informar endereço de e-mail inválido - "123"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.nome')).sendKeys(user1.nome);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys('123');
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('O endereço de E-mail informado não é valido.');
    });

    /**
     * Note: 123@123 is a valid email adress according to HTML5.
     * However, 123@123@123 is an invalid email address.
     */
    it('Deve reportar relatório de e-mail addressShould inválido endereço de e-mail inválido - "123@123@123"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.nome')).sendKeys(user1.nome);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys('123@123@123');
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('O endereço de E-mail informado não é valido.');
    });

    it('Deve informar nome de usuário ausente', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.nome')).sendKeys(user1.nome);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Username Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('É necessário informar um Nome de usuário');
    });

    it('Deve informar uma senha com menos de 10 caracteres - "P@$$w0rd!"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.nome')).sendKeys(user1.nome);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('P@$$w0rd!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('A senha deve ter pelo menos 10 caracteres.');
    });

    it('Deve informar uma senha com mais de 128 caracteres.', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.nome')).sendKeys(user1.nome);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys(')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('A senha deve ter menos de 128 caracteres.');
    });

    it('Deve informar uma senha com mais de 3 ou mais caracteres repetidos - "P@$$w0rd!!!"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.nome')).sendKeys(user1.nome);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('P@$$w0rd!!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('A senha não pode conter sequências de três ou mais caracteres repetidos.');
    });

    it('Deve informar uma senha sem letras maiúsculas - "p@$$w0rd!!"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.nome')).sendKeys(user1.nome);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('p@$$w0rd!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('A senha deve conter pelo menos uma letra maiúscula.');
    });

    it('Deve informar uma senha com menos de um número - "P@$$word!!"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.nome')).sendKeys(user1.nome);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('P@$$word!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('A senha deve conter pelo menos um número.');
    });

    it('Deve informar uma senha com menos de um carácter especial - "Passw0rdss"', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.nome')).sendKeys(user1.nome);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('Passw0rdss');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('A senha deve conter pelo menos um caractere especial.');
    });

    it('Deve registrar novo usuário com sucesso', function () {
      browser.get('http://localhost:3001/authentication/signup');
      // Enter nome
      element(by.model('vm.credentials.nome')).sendKeys(user1.nome);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter UserName
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type="submit"]')).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/');
    });

    it('Deve reportar e-mail já existe', function () {
      // Make sure user is signed out first
      signout();
      // Signup
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.nome')).sendKeys(user2.nome);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user2.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys(user2.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('strong')).get(0).getText()).toBe('Email already exists');// nao pode ser traduzido
    });

    it('Deve informar nome de usuário já existe', function () {
      // Signup
      browser.get('http://localhost:3001/authentication/signup');
      // Enter First Name
      element(by.model('vm.credentials.nome')).sendKeys(user2.nome);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user2.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys(user2.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('strong')).get(0).getText()).toBe('Username already exists');
    });

  });

  describe('Signin Validation', function () {

    it('Deve informar credenciais em falta', function () {
      // Make sure user is signed out first
      signout();
      // Sign in
      browser.get('http://localhost:3001/authentication/signin');
      // Click Submit button
      element(by.css('button[type="submit"]')).click();
      // Username Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('É necessário informar um Nome de usuário');
      // Password Error
      expect(element.all(by.css('.error-text')).get(1).getText()).toBe('É necessário informar uma senha');
    });

    it('Verifique se o usuário está logado', function() {
      // Make sure user is signed out first
      signout();
      // Sign in
      browser.get('http://localhost:3001/authentication/signin');
      // Enter UserName
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type="submit"]')).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/');
    });

  });

  describe('Alterar Configurações de Validação de senha', function () {

    it('Deve informar senhas ausentes', function () {
      browser.get('http://localhost:3001/settings/password');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Errors
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('É necessário informar sua senha atual.');
      expect(element.all(by.css('.error-text')).get(1).getText()).toBe('Informe uma nova senha.');
      expect(element.all(by.css('.error-text')).get(2).getText()).toBe('Verifique sua nova senha.');
    });

    it('Deve informar uma senha com menos de 10 caracteres - "P@$$w0rd!"', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rd!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('A senha deve ter pelo menos 10 caracteres.');
    });

    it('Deve informar uma senha com mais de 128 caracteres.', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys(')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('A senha deve ter menos de 128 caracteres.');
    });

    it('Deve informar uma senha com mais de 3 ou mais caracteres repetidos - "P@$$w0rd!!!"', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rd!!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('A senha não pode conter sequências de três ou mais caracteres repetidos.');
    });

    it('Deve informar uma senha sem letras maiúsculas - "p@$$w0rd!!"', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('p@$$w0rd!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('A senha deve conter pelo menos uma letra maiúscula.');
    });

    it('Deve informar uma senha com menos de um número - "P@$$word!!"', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$word!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('A senha deve conter pelo menos um número.');
    });

    it('Deve informar uma senha com menos de um carácter especial - "Passw0rdss"', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('Passw0rdss');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('A senha deve conter pelo menos um caractere especial.');
    });

    it('Deve informar senhas não coincidem', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter New Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rds!!');
      // Verify New Password
      element(by.model('vm.passwordDetails.verifyPassword')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Errors
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('As senhas não coincidem.');
    });

    it('Deve alterar a senha para - "P@$$w0rds!!"', function () {
      browser.get('http://localhost:3001/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter New Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rds!!');
      // Verify New Password
      element(by.model('vm.passwordDetails.verifyPassword')).sendKeys('P@$$w0rds!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Changed
      expect(element.all(by.css('.text-success')).get(0).getText()).toBe('A Senha foi alterada com sucesso.');
    });
  });
});
