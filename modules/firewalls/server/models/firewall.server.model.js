'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Firewall Schema
 */
var FirewallSchema = new Schema({
  regra: {
    type: String,
    trim: true,
    unique: true,
    required: 'Nome não pode ser vazio.'
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

mongoose.model('Firewall', FirewallSchema);
