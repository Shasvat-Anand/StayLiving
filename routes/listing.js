const express = require("express");

const router = express.Router();

// multer for multi-form data 
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})



const Listing = require("../models/Listing")

 
const ejs = require("ejs");


const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const controlListing = require("../controller/listing.js")




// Required WrapAsync
const WrapAsync = require("../util/WrapAsync.js");


router.route("/")
.get(WrapAsync(controlListing.index))
.post(isLoggedIn,  upload.array('listings[image]', 10),  WrapAsync(controlListing.createNewListing))
 
// .post(upload.array('listings[image]', 10), (req, res)=>{
//     res.send(req.files);
// })

 

router.get("/mylisting", isLoggedIn,  WrapAsync(controlListing.mycard));

router.get("/mylisting/:id", isLoggedIn, WrapAsync(controlListing.showListing));


 //  LIsting route index route 
// router.get("/",WrapAsync(controlListing.index))

// create new listing  route 
// router.post("/",validateListing, WrapAsync( controlListing.createNewListing))



//  go to create new listing route
router.get("/new", isLoggedIn, controlListing.renderNewListingForm)



router.route("/:id")
.put(isLoggedIn, isOwner, WrapAsync(controlListing.updateListing))
.get(WrapAsync(controlListing.showListing))

// editing or updating the listing
// router.put("/:id", isLoggedIn, isOwner, WrapAsync( controlListing.updateListing))

// show listing route 
// router.get("/:id", WrapAsync(controlListing.showListing))


//  deleting the list
router.delete("/:id/delete",isLoggedIn , isOwner , WrapAsync( controlListing.destroy))





// edit form route
router.get("/:id/edit", isLoggedIn, isOwner, WrapAsync( controlListing.renderEditForm))







module.exports = router