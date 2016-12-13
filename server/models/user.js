'use strict';

var Promise = require('bluebird');
var extend = require('util')._extend;

module.exports = function(user) {
  user.on('attached', function(app) {
    app.on('started', function() {
      var Role = user.app.models.Role;
      Role.registerResolver('$dynamicRole', function(role, ctx, next) {
        ctx.remotingContext.args.options = ctx.remotingContext.args.options || {};
        ctx.remotingContext.args.options.canInjectCtxOptionsInCustomRoleResolver = true;
        next();
      });
    });
  });

  user.createOptionsFromRemotingContext = function(ctx) {
    return extend(this.base.createOptionsFromRemotingContext(ctx), {
      currentUserId: ctx.req.accessToken && ctx.req.accessToken.userId,
    });
  };

  user.beforeRemote('testInjectedOptions', function(ctx, unused, next) {
    if (!ctx.args.options.accessToken) return next();
    ctx.args.options.canReadCtxOptionsInBeforeRemote = ctx.args.options.canInjectCtxOptionsInCustomRoleResolver ? true : false;
    user.findById(ctx.args.options.accessToken.userId, function(err, user) {
      if (err) return next(err);
      ctx.args.options.currentUser = user;
      next();
    });
  });

  user.observe('loaded', function(ctx, next) {
    ctx.options = ctx.options || {};
    ctx.options.canReadCtxOptionsInObserveLoaded = ctx.options.canInjectCtxOptionsInCustomRoleResolver ? true : false;
    ctx.options.canInjectCtxOptionsInObserveLoaded = true;
    next();
  });

  user.remoteMethod('testInjectedOptions', {
    http: {verb: 'get',	path: '/:id/testInjectedOptions'},
    accepts: [
      {arg: 'id', type: 'string', required: true},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'},
    ],
    returns: {arg: 'data', type: 'object', root: true},
  });

  user.testInjectedOptions = function(id, ctx) {
    return Promise.resolve({
      accessToken: ctx.accessToken,
      user: ctx.currentUser,
      currentUserId: ctx.currentUserId,
      canInjectCtxOptionsInCustomRoleResolver: ctx.canInjectCtxOptionsInCustomRoleResolver || false,
      canReadCtxOptionsInObserveLoaded: ctx.canReadCtxOptionsInObserveLoaded || false,
      canInjectCtxOptionsInObserveLoaded: ctx.canInjectCtxOptionsInObserveLoaded || false,
      canReadCtxOptionsInBeforeRemote: ctx.canReadCtxOptionsInBeforeRemote || false,
    });
  };
};
