const express = require("express")

const router = express.Router({ mergeParams: true });

const Review = require("../models/Review")

const Listing = require("../models/Listing");
const WrapAsync = require("../util/WrapAsync");

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")



// const { reviewSchema } = require("../Schema");
// const ExpressError = require("../util/ExpressError");



// module.exports = validateReview;





//  Review route 

 router.post("/", isLoggedIn, validateReview, async(req, res)=>{
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
})


router.delete("/:reviewid",isReviewAuthor, WrapAsync(async (req, res) => {
    const { id, reviewid } = req.params;

    

    // Remove review ID from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });

    // Delete the review document
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review Deleted")

    // Redirect back to listing page
    res.redirect(`/listing/${id}`);
}));

module.exports = router




//  sample data route

// app.get("/sampledata", async (req, res)=>{
//     const data1 =  new Listing({
//         title : "House on sold",
//         description: "sweet home",
//         price: 6000,
//         location: "Basti",
//         country: "India"
//     })
//     await data1.save();
//     res.send("it working")
// })
