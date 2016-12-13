'use strict';

module.exports = function(server, next) {
  var user = server.models.user;
  user.create({email: 'test@test.com', password: 'a1b2c3'})
  .then(function(user) {
    return user.accessTokens.create();
  })
  .then(function(token) {
    console.log(token);
    next();
  })
  .catch(function(err) {
    console.log(err);
    next();
  });
};
