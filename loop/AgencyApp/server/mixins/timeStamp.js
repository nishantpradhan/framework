'use strict';

module.exports = function (Model, options) {

  // capture createdDate and lastModifiedDate with every save
  Model.observe('before save', function (ctx, next) {
    if (ctx.instance) {
      if (ctx.instance.id) {
        // for existing instance
        ctx.instance.lastModifiedDate = new Date();
      } else {
        // for a new instance
        ctx.instance.lastModifiedDate = new Date();
        ctx.instance.createdDate = new Date();
      }
    } else if (ctx.data) {
      // for existing instance
      ctx.data.lastModifiedDate = new Date();
    }
    next();
  });
};
