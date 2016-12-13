'use strict';

module.exports = function enableAuthentication(server, next) {
  // enable authentication
  server.enableAuth();
  next();
};
