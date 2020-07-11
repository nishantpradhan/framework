'use strict';


module.exports = function RestError(status, message, extra) {
  this.name = this.constructor.name;
  this.message = message;
  this.status = status;
  this.extra = extra;

  Error.captureStackTrace(this, this.constructor);
};

require('util').inherits(module.exports, Error);
