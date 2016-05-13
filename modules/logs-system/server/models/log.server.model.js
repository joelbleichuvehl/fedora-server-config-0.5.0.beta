'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Log Schema
 */
var LogSchema = new Schema({
  extensao: {
    type: String,
    trim: true,
    unique: true,
    required: 'Nome não pode ser vazio.'
  },
  descricao: {
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

mongoose.model('Log', LogSchema);

