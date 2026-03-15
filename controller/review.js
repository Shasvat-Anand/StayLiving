const Listing = require("../models/Listing")
const Review = require("../models/Review")

module.exports.createReview = async(req, res)=>{
    let {rating  , comment } = req.body.review;

    if(!rating){
        rating = 5;
    }
     
    let {id} = req.params;

    
    
    let new_review = new Review({
        comment : comment,
        rating : rating
        
    })
    // console.log(new_review);
     
    let currlisting = await Listing.findById(id);

    new_review.author = req.user._id;
    console.log(new_review)

    currlisting.reviews.push(new_review)

    await new_review.save();
    await currlisting.save();
    req.flash("success","New Review created")

    res.redirect(`/listing/${id}`);
};

module.exports.destroyReview = async (req, res) => {
    const { id, reviewid } = req.params;

    

    // Remove review ID from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });

    // Delete the review document
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review Deleted")

    // Redirect back to listing page
    res.redirect(`/listing/${id}`);
};