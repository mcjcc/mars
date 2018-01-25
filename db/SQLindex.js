const Sequelize = require('sequelize');
const mysql = require('mysql');

if (process.env.DATABASE_URL) {
  var con = mysql.createConnection(process.env.DATABASE_URL);
  var db = new Sequelize(process.env.DATABASE_URL, {
    logging: true
  });
} else {
  var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });
  var db = new Sequelize('movieSentimentDB', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log('Connected!');
    con.query('CREATE DATABASE IF NOT EXISTS movieSentimentDB', function (err, result) {
      if (err) throw err;
      console.log('Database created');
    });
  });
}

db.authenticate()
  .then(() => {
    console.log('Connection established');
  })
  .catch(err => {
    console.error('Unable to connect to the database');
  });

module.exports = db;
