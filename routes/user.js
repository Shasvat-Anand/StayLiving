const express = require("express");

const router = express.Router();

const ejs = require("ejs");

const User = require("../models/User");
const passport = require("passport");
const WrapAsync = require("../util/WrapAsync");

const { saveRedirectUrl } = require("../middleware");


router.get("/signup", (req, res)=>{
    res.render("signup.ejs")
})

router.post("/signup" , WrapAsync (async(req, res)=>{

    try{

        let {username, email, password} = req.body.listing;
        const newUser = new User({email, username});
        const newregister = await User.register(newUser, password)
        
        await newregister.save();

        req.login(newregister, (err)=>{
            if(err){
                return next(err)
            }
            req.flash("success", "Welcome on StayLiving")
            res.redirect("/listing")

        })
        
        
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}))


router.get("/login", (req, res)=>{
    res.render("login.ejs")
})


router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        
        req.flash("success", "Welcome back!");
        let redirectUrl = res.locals.redirectUrl || "/listing"
        res.redirect(redirectUrl);
    }
);


router.get("/logout", (req, res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("error", "Logged You Out!");
        res.redirect("/listing");
    })
})

module.exports = router