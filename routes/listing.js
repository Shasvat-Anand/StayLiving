const express = require("express");

const router = express.Router();

const Listing = require("../models/Listing")

const {listingSchema} = require("../Schema.js")
const ejs = require("ejs");


const {isLoggedIn} = require("../middleware.js")




// Required WrapAsync
const WrapAsync = require("../util/WrapAsync.js");

//  Required Express Error which handle mongoose error
const ExpressError = require("../util/ExpressError.js")


//  Validation with Joi
const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let msg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else{
        next();
    }
}



// create new listing  route 
router.post("/",validateListing, WrapAsync( async (req, res, next)=>{   
    
    // let {n_title, n_description , n_price , n_image, n_location, n_country} = req.body;

    if(!req.body.listings){
        // console.log("vbouw ")
        throw new ExpressError (404, "Send invalid data for listing")
    }
    let new_listing = new Listing(req.body.listings);

    // const new_listing = new Listing({
    //     title : n_title,
    //     description : n_description,
    //     price : n_price,
    //     image: n_image,
    //     location : n_location,
    //     country : n_country

    // })

    // console.log(new_listing);
   
    await new_listing.save();
    req.flash("success", "New listing is created")
    res.redirect("/listing")
}))










//  go to create new listing route
router.get("/new", isLoggedIn, (req, res)=>{
    res.render("new.ejs");
})



// editing or updating the listing
router.put("/:id", isLoggedIn, WrapAsync( async (req, res)=>{
    let {id} = req.params;
 
    // const {title, image, description, price, location, country} = req.body;
    const listing = req.body.listing;
    

    // await Listing.findByIdAndUpdate(id,{title, image, description, price, location, country}, {new : true});
    await Listing.findByIdAndUpdate(id, req.body.listing, {new : true});
    req.flash("success", "Listing Upadated")
    res.redirect(`/listing/${id}`)
}))



//  deleting the list
router.delete("/:id/delete",isLoggedIn  , WrapAsync( async (req, res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted")
    res.redirect(`/listing`);
}))

// show listing route 
router.get("/:id", WrapAsync(async (req, res)=>{
    let {id} = req.params;
    let list =  await Listing.findById(id).populate("reviews");

    if(!list){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listing")
    }
    // console.log(list)
   
    res.render("show.ejs", {list})
}))




// edit form route
router.get("/:id/edit", isLoggedIn, WrapAsync( async (req, res)=>{
    let {id} = req.params;   
    let data =  await Listing.findById(id);
    
   if(!data){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listing")
    }
    res.render("editform.ejs", {data})

}))




//  LIsting route
router.get("/",WrapAsync( async (req, res )=>{
    const data = await Listing.find({})     
    
    res.render("listing.ejs", {data})
}))


module.exports = router