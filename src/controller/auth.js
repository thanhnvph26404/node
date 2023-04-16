import User from "../models/user";
import { signupSchema, signinSchema } from "../schema/auth";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const signup = async (req, res) => {
    try {
        const { error } = signupSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(err => err.message)
            return res.status(404).json({
                message: errors
            })
            
        }

        const userExist = await User.findOne({ email: req.body.email })
        if (userExist) {
            return res.status(400).json({
                message: 'email đã tồn tại',
            })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = await User.create({
            ...req.body,
            password: hashedPassword,
        })

        const token = jwt.sign({ _id: user.id }, 'thanh', { expiresIn: '1d' })
        user.password = undefined
        return res.status(200).json({
            message: 'tạo tài khoản thành công',
            accessToken: token,
            user,
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

export const signin = async (req, res) => { 
    try {
        const { error } = signinSchema.validate(req.body, { abortEarly: false })
        if (error) {
            const errors = error.details.map(err => err.message)
            return res.status(400).json({message: errors})
        }

        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({ message: 'email không tồn tại' })

        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                message: 'sai mật khẩu'
            })
        }

        const token = jwt.sign({ _id: user.id }, 'thanh', { expiresIn: '1d' })
        user.password = undefined
        return res.status(200).json({
            message: 'đăng nhập thành công',
            accessToken: token,
            user
        })
    } catch (error) {
        
    }
}