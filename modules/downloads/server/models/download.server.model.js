'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Download Schema
 */
var DownloadSchema = new Schema({
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

mongoose.model('Download', DownloadSchema);
