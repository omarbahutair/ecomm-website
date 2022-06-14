const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requireEmail: check('email')
    .trim()
    .normalizeEmail({
        gmail_remove_dots: false,
    })
    .isEmail()
    .withMessage('Invalid Email')
    .custom( async email => {
        const existingUser = await usersRepo.getOneBy({ email });
        if(existingUser){
            throw new Error('Email is used');
        } 
    }),
    requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20})
    .withMessage('password must be between 4-20 characters'),
    requireConfirmPassword: check('confirmPassword')
    .trim()
    .isLength({ min: 4, max: 20})
    .withMessage('password must be between 4-20 characters')
    .custom((confirmPassword, { req }) => {
        if (req.body.password !== confirmPassword){
            throw new Error('passwords does not match')
        }
        return true;
    }),
    emailNotFound: check('email')
    .trim()
    .normalizeEmail({
        gmail_remove_dots: false,
    })
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async (email) => {
        if(!await usersRepo.getOneBy({email})){
            throw new Error('Email not found')
        }
    }),
    incorrectPassword: check('password')
    .trim()
    .custom(async (password, { req }) => {
        const user = await usersRepo.getOneBy({ email: req.body.email });
        if(user){
            if(! await usersRepo.comparePasswords(user.password, password)) {
                throw new Error('incorrect password')
            }
        }
    })
}
