const adminMiddleware = (req, res, next) => {
  if (req.user.id_role !== 1) {
    return res.status(403).json({
      message: 'Akses hanya untuk admin.'
    });
  }

  next();
};

module.exports = adminMiddleware;