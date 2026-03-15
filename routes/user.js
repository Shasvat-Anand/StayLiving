const express = require("express");

const router = express.Router();

const ejs = require("ejs");

const User = require("../models/User");
const passport = require("passport");
const WrapAsync = require("../util/WrapAsync");

const { saveRedirectUrl } = require("../middleware");

const controlUser = require("../controller/user")


router.route("/signup")
.get(controlUser.signupForm)
.post(  WrapAsync (controlUser.signup));

router.route("/login")
.get(controlUser.loginForm)
.post(
   
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
   controlUser.login
);



// router.get("/signup",controlUser.signupForm)
// router.post("/signup" , WrapAsync (controlUser.signup))
// router.get("/login",controlUser.loginForm)
// router.post(
//     "/login",
//     saveRedirectUrl,
//     passport.authenticate("local", {
//         failureRedirect: "/login",
//         failureFlash: true
//     }),
//    controlUser.login
// );


router.get("/logout",controlUser.logout)

module.exports = router