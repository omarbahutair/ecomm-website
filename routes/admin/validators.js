const { check } = require("express-validator");
const mongoose = require("mongoose");

const User = mongoose.model("user");
const usersRepo = require("../../repositories/usersRepository");

module.exports = {
  requireTitle: check("title")
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage("title must be between 5 and 40 characters"),
  requirePrice: check("price")
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("price must be higher than 1"),
  requireEmail: check("email")
    .trim()
    .normalizeEmail({
      gmail_remove_dots: false,
    })
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (email) => {
      // get a user from the database by its email
      // if the user exist thow an error
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email is used");
      }
    }),
  requirePassword: check("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("password must be between 4-20 characters")
    .custom((password, { req }) => {
      if (req.body.confirmPassword !== password) {
        throw new Error("passwords does not match");
      }
      return true;
    }),
  requireConfirmPassword: check("confirmPassword")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("password must be between 4-20 characters")
    .custom((confirmPassword, { req }) => {
      if (req.body.password !== confirmPassword) {
        throw new Error("passwords does not match");
      }
      return true;
    }),
  emailNotFound: check("email")
    .trim()
    .normalizeEmail({
      gmail_remove_dots: false,
    })
    .isEmail()
    .withMessage("Must provide a valid email")
    .custom(async (email) => {
      // get a user from the database if the user does not exist throw an error
      if (!(await User.findOne({ email }))) {
        throw new Error("Email not found");
      }
    }),
  incorrectPassword: check("password")
    .trim()
    .custom(async (password, { req }) => {
      // get a user from the database
      // compare the password and if not correct throw an error
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (user) {
        if (!(await usersRepo.comparePasswords(user.password, password))) {
          throw new Error("incorrect password");
        }
      }
    }),
};
