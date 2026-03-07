module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        console.log(req);
        req.flash("error", "Please Logged In")
        return res.redirect("/login");
    }
    next();
}