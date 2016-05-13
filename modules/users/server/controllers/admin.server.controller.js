'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  // For security purposes only merge these parameters
  user.nome = req.body.nome;
  user.displayName = req.body.displayName;
  user.tipoPessoa = req.body.tipoPessoa;
  user.cpfCnpj = req.body.cpfCnpj;
  user.numeroRg = req.body.numeroRg;
  user.dataNascimento = req.body.dataNascimento;
  user.estadoCivil = req.body.estadoCivil;
  user.sexo = req.body.sexo;
  user.tipoEndereco = req.body.tipoEndereco;
  user.logradouro = req.body.logradouro;
  user.numero = req.body.numero;
  user.complemento = req.body.complemento;
  user.bairro = req.body.bairro;
  user.estado = req.body.estado;
  user.cidade = req.body.cidade;
  user.cep = req.body.cep;
  user.telefone = req.body.telefone;
  user.celular = req.body.celular;
  user.email = req.body.email;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  var filtro = {};
  if (req.user.roles.indexOf('root') === -1) {
    filtro = { loja: req.user.loja };
  }
  User.find(filtro, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password').populate('loja').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};
