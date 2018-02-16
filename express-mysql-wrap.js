"use strict";

module.exports = (mysqlPool, options) => {
	var errorMethod = (error, request, response, next) => {
		response.end("mysql error");
	};
	if(options && options.errorMethod && typeof(options.errorMethod) == "function") {
		errorMethod = options.errorMethod;
	}
	return (request, response, next) => {
		mysqlPool.getConnection((error, mysqlConn) => {
			if(error) {
				errorMethod(error, request, response, next);
			} else {
				request.mysqlConn = mysqlConn;
				response.on("finish", () => {
					mysqlConn.release();
				});
				next();
			}
		});
	};
};