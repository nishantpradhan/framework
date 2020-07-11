'use strict';

const app = require('../server.js');
var jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = '215cca44062dc2d6cc4dc5a1302f7c03a83abaecdacbedbbb36993009df6c5ae84073c0390c453ba95685ff15370183d1fd287032d7fef05187bc0c353541206';

module.exports = function () {
  return function authenticate(req, res, next) {
    const token = req.query.access_token;
    if (token) {
      jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        return next()
      })
    } else {
      const username = req.query.username;
      const password = req.query.password;
      const user = { name: username };
      const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET);
      app.models.AppUser.find({})
        .then(function (data) {
          let userExists = data.find(user => { return user.name == username && user.password == password; });
          if (userExists) {
            req.query.access_token = accessToken;
            return next()
          } else {
            return res.sendStatus(401);
          }
        })
    }
  }
}
