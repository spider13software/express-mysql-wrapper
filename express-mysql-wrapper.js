"use strict";

module.exports = (mysqlPool, options) => {
	var errorMethod = (error, request, response, next) => {
		response.end("mysql error");
	};
	var connPropName = "mysqlConn";
	if(options) {
		if(options.errorMethod && typeof(options.errorMethod) == "function") {
			errorMethod = options.errorMethod;
		}
		if(options.connPropName && typeof(options.connPropName) == "string") {
			connPropName = options.connPropName
		}
	}
	return (request, response, next) => {
		mysqlPool.getConnection((error, mysqlConn) => {
			if(error) {
				errorMethod(error, request, response, next);
			} else {
				request[connPropName] = mysqlConn;
				response.on("finish", () => {
					mysqlConn.release();
				});
				next();
			}
		});
	};
};