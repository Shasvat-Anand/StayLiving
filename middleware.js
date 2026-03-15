const Listing = require("./models/Listing")
const Review = require("./models/Review.js")
const {listingSchema, reviewSchema} = require("./Schema.js")

 
//  Required Express Error which handle mongoose error
const ExpressError = require("./util/ExpressError.js")

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        // console.log(req);
        
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "Please Logged In")
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async(req, res, next)=>{
    
    let {id} = req.params;

    let listings = await Listing.findById(id);
    if(!listings.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don have permission to change the Listing")
        return res.redirect(`/listing/${id}`);
    }


    next();
}


module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let msg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {

    const { error, value } = reviewSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    req.body = value;   // important step
    next();
};
 


module.exports.isReviewAuthor= async(req, res, next)=>{
    
    let {id, reviewid} = req.params;

    let Reviews = await Review.findById(reviewid);
    console.log(Reviews)
    if(!Reviews.author.equals(res.locals.currUser._id)){
        req.flash("error", "You don have permission to change the Review")
        return res.redirect(`/listing/${id}`);
    }


    next();
}