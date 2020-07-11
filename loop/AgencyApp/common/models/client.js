'use strict';
const RestError = require('../../server/utils/rest-error.js');

module.exports = function (Client) {

  Client.createClient = function (name, email, phoneNumber, totalBill, agencyId, callback) {
    const promise = new Promise(function (resolve, reject) {

      if (!agencyId) {
        return reject(new RestError(400, 'Agency Id missing!'));
      }

      Client.create({
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        totalBill: totalBill,
        'fk_id_agency': agencyId
      })
        .then(client => {
          console.log('Created new Client');

          return resolve(client);
        }).catch(reject);
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
  }

  Client.remoteMethod('createClient', {
    accepts: [
      {
        arg: 'name',
        type: 'string',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'email',
        type: 'string',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'phoneNumber',
        type: 'string',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'totalBill',
        type: 'number',
        required: true,
        http: {
          source: 'number'
        }
      },
      {
        arg: 'agencyId',
        type: 'number',
        required: true,
        http: {
          source: 'number'
        }
      }
    ],
    returns: {
      arg: 'data',
      type: 'object',
      root: true
    },
    http: {
      path: '/createClient',
      verb: 'POST'
    },
    description: 'create new client'
  });


  Client.updateClientDetails = function (id, name, email, phoneNumber, totalBill, agencyId, callback) {
    const promise = new Promise(function (resolve, reject) {

      if (!id) {
        return reject(new RestError(400, 'clientId tp update missing!'));
      }

      if (!agencyId) {
        return reject(new RestError(400, 'Agency Id missing!'));
      }

      Client.updateAll({ id: id },
        {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          totalBill: totalBill,
          'fk_id_agency': agencyId
        })
        .then(function () {

          return resolve({ success: true });
        }).catch(reject);
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
  }

  Client.remoteMethod('updateClientDetails', {
    accepts: [
      {
        arg: 'id',
        type: 'number',
        required: true,
        http: {
          source: 'path'
        }
      },
      {
        arg: 'name',
        type: 'string',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'email',
        type: 'string',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'phoneNumber',
        type: 'string',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'totalBill',
        type: 'number',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'agencyId',
        type: 'number',
        required: true,
        http: {
          source: 'query'
        }
      }
    ],
    returns: {
      arg: 'data',
      type: 'object',
      root: true
    },
    http: {
      path: '/:id/updateClientDetails',
      verb: 'POST'
    },
    description: 'update client'
  });

}

