const express = require("express");

const router = express.Router();

const Listing = require("../models/Listing")

 
const ejs = require("ejs");


const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const controlListing = require("../controller/listing.js")




// Required WrapAsync
const WrapAsync = require("../util/WrapAsync.js");


 


 //  LIsting route index route 
router.get("/",WrapAsync(controlListing.index))




// create new listing  route 
router.post("/",validateListing, WrapAsync( controlListing.createNewListing))










//  go to create new listing route
router.get("/new", isLoggedIn, controlListing.renderNewListingForm)



// editing or updating the listing
router.put("/:id", isLoggedIn, isOwner, WrapAsync( controlListing.updateListing))



//  deleting the list
router.delete("/:id/delete",isLoggedIn , isOwner , WrapAsync( controlListing.destroy))

// show listing route 
router.get("/:id", WrapAsync(controlListing.showListing))




// edit form route
router.get("/:id/edit", isLoggedIn, isOwner, WrapAsync( controlListing.renderEditForm))







module.exports = router