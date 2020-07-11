'use strict';

const async = require('async');
const _ = require('underscore');
const datasourceExclusionList = [];
const datasourcesToMigrateEvenIfIsActual = [];

// // This script does not MIGRATE models, rather UPDATES them. Check loopback docs for difference.
module.exports = function (app, cb) {
  //Strictly for development environment

  if (app.NODE_ENV === 'development' && process.argv && process.argv[2] && process.argv[2] === 'skip-migration') {
    return cb();
  }

  let modelsToUpdate = [];
  let mysqlModelsForForeignKeysCreation = [];
  function updateModel(model, callback) {
    app.models[model].getDataSource().isActual(model, function (err, isActual) {
      if (err) {
        console.error('An error occured while updating model ' + model);
        console.error(err);
        return callback(err);
      } else {
        if (isActual == true && datasourcesToMigrateEvenIfIsActual.indexOf(app.models[model].getDataSource().connector.name) == -1) {
          callback();
        } else {
          app.models[model].getDataSource().autoupdate(model, function (err, data) {
            if (err) {
              console.error('An error occured while updating model ' + model);
              console.error(err);
              return callback(err);
            } else {
              console.log('Auto updated model ' + model);
              return callback();
            }
          });
        }
      }
    });
  }

  for (var key in app.models) {
    if (app.models[key].getDataSource() &&
      app.models[key].getDataSource().connector &&
      datasourceExclusionList.indexOf(app.models[key].getDataSource().connector.name) == -1) {
      modelsToUpdate.push(key);
      if (app.models[key].getDataSource().connector && ['mysql'].indexOf(app.models[key].getDataSource().connector.name) > -1) {
        mysqlModelsForForeignKeysCreation.push(key);
      }
    }
  }

  async.eachSeries(modelsToUpdate, updateModel, function (error) {
    if (error) {
      cb(error);
    } else {
      cb();
    }
  });

};
