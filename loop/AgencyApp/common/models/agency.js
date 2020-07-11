'use strict';
const RestError = require('../../server/utils/rest-error.js');

module.exports = function (Agency) {

  Agency.createAgency = function (name, address1, address2, state, city, phoneNumber, clientName,
    clientEmail, clientPhoneNumber, totalBill, callback) {
    const promise = new Promise(function (resolve, reject) {

      let { ...agencyObj } = { name, address1, address2, state, city, phoneNumber };

      Agency.create(agencyObj)
        .then(agency => {

          return Agency.app.models.Client.createClient(clientName, clientEmail, clientPhoneNumber, totalBill, agency.id);
        })
        .then(function () {

          console.log('Created new Agency');
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

  Agency.remoteMethod('createAgency', {
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
        arg: 'address1',
        type: 'string',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'address2',
        type: 'string',
        required: false,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'state',
        type: 'string',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'city',
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
        arg: 'clientName',
        type: 'string',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'clientEmail',
        type: 'string',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'clientPhoneNumber',
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
      }
    ],
    returns: {
      arg: 'data',
      type: 'object',
      root: true
    },
    http: {
      path: '/createAgency',
      verb: 'POST'
    },
    description: 'create new agency'
  });

  Agency.fetchTopClientDetails = function (callback) {
    const promise = new Promise(function (resolve, reject) {
      let resp = {};

      Agency.find({ include: [{ relation: 'client' }] })
        .then(agencies => {

          let topAgencies = [];
          agencies.forEach(agency => {
            resp = {};
            resp.AgencyName = agency.name
            resp.ClientName = agency.client() ? agency.client().name : null;
            resp.TotalBill = agency.client() ? agency.client().totalBill : null;
            topAgencies.push(resp);
          });

          topAgencies = topAgencies.sort(function (a, b) { return b.TotalBill - a.TotalBill; });

          return resolve(topAgencies);
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

  Agency.remoteMethod('fetchTopClientDetails', {
    accepts: [
    ],
    returns: {
      arg: 'data',
      type: 'object',
      root: true
    },
    http: {
      path: '/fetchTopClientDetails',
      verb: 'GET'
    },
    description: 'fetch top client of agency'
  });

}

