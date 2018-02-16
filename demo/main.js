"use strict";

const express = require("express");
const mysql = require("mysql");
const expressMysqlWrapper = require("../express-mysql-wrap.js");
const config = require("./config.json");

const mysqlPool = mysql.createPool(config.mysql);

var httpServer = express();
httpServer.use(expressMysqlWrapper(mysqlPool, {
	"errorMethod": (error, request, response, next) => {
		response.end("mysql error: " + error.message);
	}
}));

httpServer.get("/", (request, response, next) => {
	request.mysqlConn.query("SELECT 1 + 1 AS `value`", (error, rowList, fieldList) => {
		if(error) {
			response.end("mysql error");
		} else {
			response.end("value is " + rowList[0].value);
		}
	})
});

httpServer.listen(config.httpServer.port);