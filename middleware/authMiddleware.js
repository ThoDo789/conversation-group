const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  jwt.verify(token, "a29454c03afa2e401fec99bb1783d86186c7dfd330e1b6d6d760b99e9d1d156fc16433cefedba9557103e9125acb377141aae14fab8efe3de6f3f642b5f134c4", (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token.');
    }
    req.user = user; // Save user info for use in the routes
    next();
  });
};

module.exports = authenticateToken;