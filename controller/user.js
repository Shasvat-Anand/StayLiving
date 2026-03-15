const User = require("../models/User")

module.exports.signupForm =  (req, res)=>{
    res.render("signup.ejs")
};

module.exports.signup = async(req, res)=>{

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
};

module.exports.loginForm =  (req, res)=>{
    res.render("login.ejs")
}

module.exports.login =  (req, res) => {
        
        req.flash("success", "Welcome back!");
        let redirectUrl = res.locals.redirectUrl || "/listing"
        res.redirect(redirectUrl);
};

module.exports.logout =  (req, res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("error", "Logged You Out!");
        res.redirect("/listing");
    })
};