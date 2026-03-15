const express = require("express")

const router = express.Router({ mergeParams: true });

const Review = require("../models/Review")

const Listing = require("../models/Listing");
const WrapAsync = require("../util/WrapAsync");

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")

const controlReview = require("../controller/review")


//  Review route 

 router.post("/", isLoggedIn, validateReview,controlReview.createReview )


router.delete("/:reviewid",isReviewAuthor, WrapAsync(controlReview.destroyReview));

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
