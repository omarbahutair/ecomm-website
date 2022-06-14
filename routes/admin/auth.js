const express = require('express');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin')
const { check, validationResult } = require('express-validator');
const { requireEmail, requirePassword, requireConfirmPassword, emailNotFound, incorrectPassword } = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }))
})

router.post('/signup', [
    requireEmail,
    requirePassword,
    requireConfirmPassword
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.send(signupTemplate({ req, errors }))
    }

    const user = await usersRepo.create({
        email: req.body.email,
        password: req.body.password
    });


    req.session.userId = user.id;

    res.send("account created")
})

router.get('/signout', (req, res)=>{
    req.session = null;
    res.send('signed out')
})

router.get('/signin', (req, res)=>{
    res.send(signinTemplate({}))
})

router.post('/signin', [
    emailNotFound,
    incorrectPassword
],async (req, res) => {
    const errors = validationResult(req)
    if(! errors.isEmpty()){
        return res.send(signinTemplate({ errors }))
    }
    const {email, password} = req.body;
    const user = await usersRepo.getOneBy({email});
    req.session.userId = user.id;
    res.send('you are signed in')
})

module.exports = router