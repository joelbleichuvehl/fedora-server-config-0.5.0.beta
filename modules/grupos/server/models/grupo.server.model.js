'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Grupo Schema
 */
var GrupoSchema = new Schema({
  nome: {
    type: String,
    trim: true,
    unique: true,
    required: 'Nome não pode ser vazio.'
  },
  descricao: {
    type: String,
    default: '',
    trim: true
  },
  permissaoGrupo: {
    type: String,
    trim: true
  },
  permissaoDiretorio: {
    type: String,
    trim: true
  },
  permissaoArquivo: {
    type: String,
    trim: true
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

mongoose.model('Grupo', GrupoSchema);
