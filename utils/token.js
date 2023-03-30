const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const checkToken = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return (res || {}).status(401).json({ error: 'No token provided' });
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);
    // Attach the decoded token to the request object for later use
    req.user = decoded;
    next();
  } catch (err) {
    return (res || {}).status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { checkToken };
