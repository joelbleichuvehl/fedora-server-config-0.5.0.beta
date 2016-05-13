'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  Ambiente = mongoose.model('Ambiente'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Ambiente
 */
exports.create = function(req, res) {
  var ambiente = new Ambiente(req.body);
  ambiente.user = req.user;

  ambiente.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      geraDhcpd();
      res.jsonp(ambiente);
    }
  });
};

/**
 * Show the current Ambiente
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var ambiente = req.ambiente ? req.ambiente.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  ambiente.isCurrentUserOwner = req.user && ambiente.user && ambiente.user._id.toString() === req.user._id.toString();

  res.jsonp(ambiente);
};

/**
 * Update a Ambiente
 */
exports.update = function(req, res) {
  var ambiente = req.ambiente;

  ambiente = _.extend(ambiente, req.body);

  ambiente.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      geraDhcpd();
      res.jsonp(ambiente);
    }
  });
};

/**
 * Delete an Ambiente
 */
exports.delete = function(req, res) {
  var ambiente = req.ambiente;

  ambiente.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      geraDhcpd();
      res.jsonp(ambiente);
    }
  });
};

/**
 * List of Ambientes
 */
exports.list = function list(req, res) {
  Ambiente.find().sort('-created').populate('user', 'displayName').exec(function(err, ambientes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ambientes);
    }
  });
};

function listAmbientes() {
  Ambiente.find().sort('-created').populate('user', 'displayName').exec(function(err, ambientes) {
    if (err) {
      console.log(err);
    } else {
      return ambientes;
    }
  });
}

/**
 * Ambiente middleware
 */
exports.ambienteByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Ambiente is invalid'
    });
  }

  Ambiente.findById(id).populate('user', 'displayName').populate('dispositivos').exec(function (err, ambiente) {
    if (err) {
      return next(err);
    } else if (!ambiente) {
      return res.status(404).send({
        message: 'No Ambiente with that identifier has been found'
      });
    }
    req.ambiente = ambiente;
    next();
  });
};

exports.gerar = geraDhcpd();

function geraDhcpd() {

  var writeStream = fs.createWriteStream('./linuxconf/dhcpd.conf', { defaultEnconding: 'utf8' });
  writeStream.write('### File: dhcpd.conf gerador por fedora-server-conf.');
  writeStream.write('\n\n');
  writeStream.write('\ndefault-lease-time 600;');
  writeStream.write('\nmax-lease-time 7200;');
  writeStream.write('\n');
  writeStream.write('\nserver-identifier master.cetesc.local;');
  writeStream.write('\noption domain-name	"cetesc.local";');
  writeStream.write('\noption domain-name-servers	10.1.10.254;');
  writeStream.write('\noption host-name	"cetesc.cetesc.local"');
  writeStream.write('\noption netbios-name-servers	10.1.10.254;');
  writeStream.write('\noption routers	10.1.10.254;');
  writeStream.write('\noption subnet-mask	255.255.255.0;');
  writeStream.write('\nsubnet 10.1.10.0 netmask 255.255.255.0 {');
  writeStream.write('\n    range dynamic-bootp 10.1.10.200 10.1.10.240;');
  writeStream.write('\n    option domain-name		"cetesc.local";');
  writeStream.write('\n    option domain-name-servers		10.1.10.254;');
  writeStream.write('\n    option host-name		"cetesc.cetesc.local";');
  writeStream.write('\n    option netbios-name-servers		10.1.10.254;');
  writeStream.write('\n    option routers		10.1.10.254;');
  writeStream.write('\n    option subnet-mask		255.255.255.0;');
  writeStream.write('\n}');
  writeStream.write('\n');
  writeStream.write('\n### Atribuição de ips fixos via mac address');
  writeStream.write('\n');

  Ambiente.find().populate('dispositivos').sort('nome').exec(function(err, ambientes) {
    if (err) {
      console.log(err);
    } else {
      ambientes.forEach(function (ambiente) {
        ambiente.dispositivos.forEach(function (dispositivo) {
          writeStream.write('\nhost ' + dispositivo.nome + ' {');
          writeStream.write('\n    hardware ethernet ' + dispositivo.mac + ';');
          writeStream.write('\n    fixed-address ' + dispositivo.ip + ';');
          writeStream.write('\n    option subnet-mask 255.255.255.0;');
          writeStream.write('\n}');
          writeStream.write('\n');
        });
      });
    }
  });

}
