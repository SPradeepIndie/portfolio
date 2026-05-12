var fs = require('fs');
var path = require('path');

exports.up = function (db) {
  var sqlPath = path.join(__dirname, '001_initial_portfolio.up.sql');
  var sql = fs.readFileSync(sqlPath, 'utf8');
  return db.runSql(sql);
};

exports.down = function (db) {
  var sqlPath = path.join(__dirname, '001_initial_portfolio.down.sql');
  var sql = fs.readFileSync(sqlPath, 'utf8');
  return db.runSql(sql);
};

exports._meta = {
  version: 1
};
