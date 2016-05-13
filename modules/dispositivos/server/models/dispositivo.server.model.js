'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Dispositivo Schema
 */
var DispositivoSchema = new Schema({
  numero: {
    type: Number,
    min: 1,
    max: 99
  },
  nome: {
    type: String,
    trim: true,
    unique: true,
    required: 'Nome não pode ser vazio.'
  },
  mac: {
    type: String,
    trim: true,
    required: 'Mac Address não pode ser vazio.',
    unique: true,
    validate: {
      validator: function(v) {
        return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(v);
      },
      message: '{VALUE} não é um Mac Address válido! Ex: 33:af:23:ea:3d:5f'
    }
  },
  ip: {
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
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Dispositivo', DispositivoSchema);
