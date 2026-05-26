const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({
      message: 'Akses ditolak. Token tidak ditemukan.'
    });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({
      message: 'Token tidak valid.'
    });
  }
};

module.exports = authMiddleware;