'use strict';

module.exports = function (AppUser) {

  AppUser.login = function (username, password, req, res, callback) {
    const promise = new Promise(function (resolve, reject) {


      return resolve({ success: true, msg: 'User logged in', accessToken: req.query.access_token });
    });
    if (typeof callback === 'function' && callback !== null) {
      promise.
        then(function (data) {
          return callback(null, data);
        }).catch(function (err) {
          return callback(err);
        });
    } else {
      return promise;
    }
  };

  AppUser.remoteMethod('login', {
    accepts: [
      {
        arg: 'username',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'password',
        type: 'string',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'req',
        type: 'object',
        http: {
          source: 'req'
        }
      },
      {
        arg: 'res',
        type: 'object',
        required: true,
        http: {
          source: 'res'
        }
      }
    ],
    returns: {
      arg: 'data',
      type: 'object',
      root: true
    },
    http: {
      path: '/login',
      verb: 'GET'
    },
    description: 'login api'
  });
}
