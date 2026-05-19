const Listing = require("../models/Listing")


// this is for Mapbox map---
const { uploadToCloudinary } = require('../cloudConfig')
const mbxgeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeoCoding({accessToken : mapToken})
// -----



module.exports.index = async (req, res )=>{
    // const data = await Listing.find({}) 
    // const data = await Listing.find().sort({singleprice : 1})

    let filterquery = {};
    let sortquery = {};

    if(req.query.bedtype){
        filterquery.bedtype = req.query.bedtype;
    }

    if(req.query.roomtype){
        filterquery.roomtype = req.query.roomtype
    }

    if(req.query.hosteltype){
        filterquery.hosteltype = req.query.hosteltype;
    }

    if(req.query.Brand){
        filterquery.Brand = req.query.Brand;
    }

    if(req.query.price == 'asc'){
        sortquery.price = 1;
    }

    else if(req.query.price == 'desc'){
        sortquery.price = -1;
    }





    console.log(filterquery , "filter");
    console.log(sortquery , "sort");

 
     

    const data = await Listing.find(filterquery).sort(sortquery);

    if(data.length >= 1){
        console.log(data);

        res.render("listing.ejs", {data, filters : req.query});
    }
    else{
        console.log(data)
    
        res.send("not found any listing")
    }
      

   
     
    
    // res.render("listing.ejs", {data})
};


module.exports.mycard = async(req, res)=> {
 
    const curr = res.locals.currUser;
 
    console.log(curr._id);
    
    const data = await Listing.find({ owner: curr._id });
    
    // console.log(data);

    res.render("mylisting.ejs", {data});
 
    
};


module.exports.renderNewListingForm = (req, res)=>{
    res.render("new.ejs");
};

module.exports.createNewListing = async (req, res, next)=>{   
    
    // let {n_title, n_description , n_price , n_image, n_location, n_country} = req.body;

    if(!req.body.listings){
        // console.log("vbouw ")
        throw new ExpressError (404, "Send invalid data for listing")
    }

    // delete req.body.listings.image;


    const response = await geocodingClient.forwardGeocode({
    query: req.body.listings.location,
    limit : 1,
    })
    .send()

 

    let new_listing = new Listing(req.body.listings);

    console.log(new_listing)

    new_listing.owner = req.user._id;

    if (req.files && req.files.length > 0) {
        // Upload each file buffer to Cloudinary first
        const uploadedImages = await Promise.all(
            req.files.map(file => uploadToCloudinary(file.buffer, file.mimetype))
        );

        new_listing.image = uploadedImages.map(result => ({
            url: result.secure_url,
            filename: result.public_id,
        }));
    } else {
        new_listing.image = [{
            url: "https://i.pinimg.com/736x/ea/4c/da/ea4cdacc7cf0ac485a4a0589baf4df8b.jpg",
            filename: "default"
        }];
    }

    new_listing.geometry = response.body.features[0].geometry;

    console.log(new_listing);


  

    // console.log(new_listing);
   
    await new_listing.save();
    req.flash("success", "New listing is created")
    res.redirect("/listing")
};

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    let list =  await Listing.findById(id).populate({path:"reviews", populate:{path : "author"}}).populate("owner");

    

    if(!list){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listing")
    }
    // console.log(list)
   
    res.render("show.ejs", {list})
};

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;   
    let data =  await Listing.findById(id);

    

  
    
   if(!data){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listing")
    }
    res.render("editform.ejs", {data})

};

module.exports.updateListing = async (req, res)=>{
    let {id} = req.params;
 
    // const {title, image, description, price, location, country} = req.body;
    const listing = req.body.listing;

   
    console.log(listing);

    const response = await geocodingClient.forwardGeocode({
    query: listing.location,
    limit : 1,
    })
    .send()

    
    // await Listing.findByIdAndUpdate(id,{title, image, description, price, location, country}, {new : true});
    listing.geometry = response.body.features[0].geometry;
    await Listing.findByIdAndUpdate(id, req.body.listing, {new : true});
    req.flash("success", "Listing Upadated")
    res.redirect(`/listing/${id}`)
};


module.exports.destroy = async (req, res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted")
    res.redirect(`/listing`);
}