'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Usuario Schema
 */
var UsuarioSchema = new Schema({
  nome: {
    type: String,
    trim: true,
    unique: true,
    required: 'Nome não pode ser vazio.'
  },
  senha: {
    type: String,
    trim: true,
    required: 'Senha não pode ser vazio.'
  },
  grupos: [{
    type: Schema.ObjectId,
    ref: 'Grupo'
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

mongoose.model('Usuario', UsuarioSchema);
