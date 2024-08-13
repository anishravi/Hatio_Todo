const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
  const token = req.headers['token'];
  // console.log(token)

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret_key');

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token: User not found' });
    }
    req.user = { userId: user.id, email: user.email };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Failed to authenticate token' });
  }
};

module.exports = authenticate;
