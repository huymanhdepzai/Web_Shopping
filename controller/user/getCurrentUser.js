const User = require("../../models/User");

module.exports = async (req, res) => {
    try {
        
        const userId = req.user.userId;

        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng"
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                isAdmin: user.isAdmin,
                address: user.address,
                phone: user.phone
            }
        });
    } catch (err) {
        console.error('Get current user error:', err);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: err.message
        });
    }
}; 