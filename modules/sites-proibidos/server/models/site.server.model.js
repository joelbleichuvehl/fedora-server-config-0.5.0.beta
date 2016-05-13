'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Site Schema
 */
var SiteSchema = new Schema({
  nome: {
    type: String,
    trim: true,
    unique: true,
    required: 'site não pode ser vazio.'
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

mongoose.model('Site', SiteSchema);
