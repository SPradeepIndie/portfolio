var fs = require('fs');
var path = require('path');

exports.up = function (db) {
  var sqlPath = path.join(__dirname, '004_enhance_portfolio_ui_ux.up.sql');
  var sql = fs.readFileSync(sqlPath, 'utf8');
  return db.runSql(sql);
};

exports.down = function (db) {
  var sqlPath = path.join(__dirname, '004_enhance_portfolio_ui_ux.down.sql');
  var sql = fs.readFileSync(sqlPath, 'utf8');
  return db.runSql(sql);
};

exports._meta = {
  version: 1
};
