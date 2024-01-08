const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET;

const database = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DATABASE
});

database.connect((error) => {
  if (error) {
    console.error('Error connecting to database', error);
  } else {
    console.log('Connected to database');
  }
})

module.exports = {
  port,
  sessionSecret,
  database
}