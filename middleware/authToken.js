function authToken(req, res, next) {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
        success: false,
        error: true
      });
    }

    req.userId = req.session.userId;
    next();
  }
  
  module.exports = authToken;
  