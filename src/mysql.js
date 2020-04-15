var url=require('url');
var fs=require('fs');
var mysql=require('mysql');
var connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  socketPath:`/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
  multipleStatements: true,
});
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
exports.connection=connection;
