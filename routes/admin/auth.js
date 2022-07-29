const express = require("express");
const usersRepo = require("../../repositories/usersRepository");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePassword,
  requireConfirmPassword,
  emailNotFound,
  incorrectPassword,
} = require("./validators");
const { handleErrors } = require("./middlewares");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  "/signup",
  [requireEmail, requirePassword, requireConfirmPassword],
  handleErrors(signupTemplate),
  async (req, res) => {
    // create user in the database
    // set the req.session.userId to be the id of the user
    const user = await usersRepo.create({
      email: req.body.email,
      password: req.body.password,
    });

    req.session.userId = user.id;

    res.redirect("/admin/products");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.redirect("/signin");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  "/signin",
  [
    emailNotFound, // check if email exist
    incorrectPassword, // check if the password is correct
  ],
  handleErrors(signinTemplate),
  async (req, res) => {
    // get the user with the given email
    // set the req.session.userId to be the id of the founded record
    const { email, password } = req.body;
    const user = await usersRepo.getOneBy({ email });
    req.session.userId = user.id;
    console.log(`${user.id} signed in`);
    return res.redirect("/admin/products");
  }
);

module.exports = router;
