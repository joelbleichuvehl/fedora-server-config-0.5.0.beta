'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ambiente Schema
 */
var AmbienteSchema = new Schema({
  nome: {
    type: String,
    default: '',
    trim: true,
    required: 'Nome do ambiente não pode ser vazio.'
  },
  descricao: {
    type: String,
    default: '',
    trim: true
  },
  dispositivos: [{
    type: Schema.ObjectId,
    ref: 'Dispositivo'
  }],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Ambiente', AmbienteSchema);
