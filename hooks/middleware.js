const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if(!token) {
    res.send("We need a token");
  } else {
    jwt.verify(token, process.env.token, (err, decoded) => {
      if (err) {
        res.json({
          auth: false,
          message: 'Failed to authenticate'
        });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
}

module.exports = {
  verifyToken
}