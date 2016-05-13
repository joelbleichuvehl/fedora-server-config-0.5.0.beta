'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rede Schema
 */
var RedeSchema = new Schema({
  ipIntranet: {
    type: String,
    trim: true,
    unique: true,
    required: 'IP não pode ser vazio.',
    validate: {
      validator: function(v) {
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
      },
      message: '{VALUE} não é um um Número de IP válido! Ex: 192.168.1.23'
    }
  },
  mascaraIntranet: {
    type: String,
    trim: true,
    unique: true,
    required: 'Máscara não pode ser vazio.',
    validate: {
      validator: function(v) {
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
      },
      message: '{VALUE} não é uma máscara válida! Ex: 255.255.255.0'
    }
  },
  gatewayIntranet: {
    type: String,
    trim: true,
    unique: true,
    required: 'Gateway não pode ser vazio.',
    validate: {
      validator: function(v) {
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
      },
      message: '{VALUE} não é um gateway válido! Ex: 255.255.255.0'
    }
  },
  tipoInternet: {
    type: String,
    trim: true
  },
  ipInternet: {
    type: String,
    trim: true,
    unique: true,
    required: 'IP não pode ser vazio.',
    validate: {
      validator: function(v) {
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
      },
      message: '{VALUE} não é um um Número de IP válido! Ex: 192.168.1.23'
    }
  },
  mascaraInternet: {
    type: String,
    trim: true,
    unique: true,
    required: 'Máscara não pode ser vazio.',
    validate: {
      validator: function(v) {
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
      },
      message: '{VALUE} não é uma máscara válida! Ex: 255.255.255.0'
    }
  },
  gatewayInternet: {
    type: String,
    trim: true,
    unique: true,
    required: 'Gateway não pode ser vazio.',
    validate: {
      validator: function(v) {
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
      },
      message: '{VALUE} não é um gateway válido! Ex: 255.255.255.0'
    }
  },
  dominio: {
    type: String,
    trim: true,
    required: 'Domínio não pode ser vazio.'
  },
  nome: {
    type: String,
    trim: true,
    unique: true,
    required: 'Nome do servidor não pode ser vazio.'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Rede', RedeSchema);
