import jwt from 'jsonwebtoken'
import User from '../models/user'

export const checkPermission = async (req, res, next) => { 
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!authHeader) {
        return res.status(401).json({
            message: 'bạn chưa đăng nhập',
        })
    }

    jwt.verify(token, 'thanh', async (err, payload) => {
        
        if (err) {
            if (err.name === "JsonWebTokenError") { 
                return res.status(400).json({
                    message: 'token không hợp lệ',
                })
            }
    
            if (err.name === 'TokenExpiredError') { 
                return res.status(400).json({
                    message: 'token hết hạn'
                })
            }
        }
        
        const user = await User.findById(payload._id)
        if (user.role !== 'admin') { 
            return res.status(403).json({
                message: 'Bạn không có quyền thực hiện hành động này',
            })
        }
        next()
    })
}