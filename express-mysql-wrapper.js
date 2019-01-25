'use strict';

const onFinished = require('on-finished');

module.exports = (mysqlPool, options) => {
  var connPropName = 'mysqlConn';
  if (options) {
    if (options.connPropName && typeof(options.connPropName) == 'string') {
      connPropName = options.connPropName;
    }
  }
  return (request, response, next) => {
    mysqlPool.getConnection((error, mysqlConn) => {
      if (error) {
        next(error);
      } else {
        request[connPropName] = mysqlConn;
        onFinished(response, function (error) {
          mysqlConn.release();
        });
        next();
      }
    });
  };
};