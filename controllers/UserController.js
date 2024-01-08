const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const userRegister = async (req, res) => {
  const { username, password, email } = req.body;
  const database = req.db;

  try {
    database.query('SELECT * FROM user WHERE username = ? OR email = ?', [username, email],
      (error, result) => {
        if (result.length > 0) {
          const emailExist = result[0].email === email;
          const usernameExist = result[0].username === username;

          if (usernameExist) {
            return res.send({ message : 'Username already exists'});
          }

          if (emailExist) {
            return res.send({ message : 'Email already exists'});
          }
        } else {
          bcrypt.hash(password, 10, (error, hash) => {
            database.query('INSERT INTO user (username, password, email) VALUES (?, ?, ?)', [username, hash, email]);
            return res.send({ message : 'User registered'});
          });
        }
      });
  } catch (error) {
    console.error('Error registering user', error);
    res.send({ message : error});
  }
}

const userLogin = (req, res) => {
  const { username, password } = req.body;
  const database = req.db;

  try {
    database.query('SELECT * FROM user WHERE username = ?', [username],
      (error, result) => {
        if (result.length > 0) {
          bcrypt.compare(password, result[0].password, (error, response) => {
            if (response) {
              const id = result[0].id;
              const token = jwt.sign({id}, process.env.token, {
                expiresIn: 300
              });

              req.session.user = result[0];
              res.json({
                auth: true,
                token: token,
                result: result.username
              })
            } else {
              res.send({ 
                auth: false, 
                message: 'No user found' 
              });
            }
          });
        } else {
          res.send({ 
            auth: false, 
            message: 'No user found' 
          });
        }
      });
  } catch (error) {
    console.error('Error logging in', error);
    res.send({ message : error});
  }
}

const userLog = (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true });
  } else {
    res.send({ loggedIn: false });
  }
}

const userLogout = (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        return res.send({ message: 'Error logging out' });
      }
  
      res.clearCookie('userid'); // Replace 'userid' with the name of your session cookie if it's different
      res.send({ message: 'Logged out'});
    });
  } else {
    res.send({ message: 'No user logged in' });
  }
}

const userDelete = (req, res) => {
  const { username, password, email } = req.body;
  const database = req.db;

  try {
    database.query('SELECT * FROM user WHERE username = ? AND email = ?', [username, email],
      (error, result) => {
        if (result.length > 0) {
          bcrypt.compare(password, result[0].password, (error, response) => {
            if (response) {
              database.query('DELETE FROM user WHERE username = ? AND email = ?', [username, email]);
              res.send({ message : 'User deleted'});
            } else {
              res.send({ message : 'No user found'});
            }
          });
        } else {
          res.send({ message : 'No user found'});
        }
      })
  } catch (error) {
    console.error('Error deleting user', error);
    res.send({ message : error});
  }
}

const userIsAuth = (req, res) => {
  res.send({ message: 'User is authenticated' });
}

module.exports = {
  userLogin,
  userLog,
  userLogout,

  userRegister,
  userDelete,

  userIsAuth    // Can remove
}