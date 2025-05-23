const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: "Không tìm thấy token xác thực",
        success: false,
        error: true
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      isAdmin: decoded.isAdmin
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: "Token đã hết hạn",
        success: false,
        error: true
      });
    }
    
    return res.status(401).json({
      message: "Token không hợp lệ",
      success: false,
      error: true
    });
  }
}

module.exports = authToken;
  