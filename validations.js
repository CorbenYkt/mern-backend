import { body } from 'express-validator';

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
];

export const RegisterValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullName').isLength({ min: 3 }),
    body('avatarUrl').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Enter title').isLength({ min: 3 }).isString(),
    body('text', 'Enter text').isLength({ min: 10 }).isString(),
    body('tags', 'Enter array of tags').optional().isString(),
    body('imageUrl', 'Incorrect image URL').optional().isString(),
];

