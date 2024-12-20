import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';

export const Register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatar: req.body.avatar,
            passwordHash: hash,
        });

        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id,
        }, 'secretkey',
            {
                expiresIn: '30d'
            });

        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error: User registration error',
        })
    }
}


export const Login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Invalid email or password!',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'secretkey',
            {
                expiresIn: '30d'
            });

        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Error: Failed to log in!',
        })
    }
}

export const GetMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const { passwordHash, ...userData } = user._doc;
        res.json({
            userData
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Noa access!'
        })
    }
}