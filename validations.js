import { body } from 'express-validator';

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
];

export const RegisterValidation = [
    body('email', 'Incorrect email format').isEmail(),
    body('password', 'Password length must be at least 6 characters').isLength({ min: 6 }),
    body('fullName', 'Full name length must be at least 3 characters').isLength({ min: 3 }),
    body('avatarUrl').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Enter title, at least 3 characters').isLength({ min: 3 }).isString(),
    body('text', 'Enter text, at least 10 characters').isLength({ min: 10 }).isString(),
    //body('tags', 'Enter array of tags').optional().isString(),
    body('imageUrl', 'Incorrect image URL').optional().isString(),
];