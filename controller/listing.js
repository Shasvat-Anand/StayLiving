const Listing = require("../models/Listing")

module.exports.index = async (req, res )=>{
    const data = await Listing.find({})     
    
    res.render("listing.ejs", {data})
};


module.exports.mycard = async(req, res)=> {
 
    const curr = res.locals.currUser;
 
    console.log(curr._id);
    
    const data = await Listing.find({ owner: curr._id });
    console.log(data);
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
    let new_listing = new Listing(req.body.listings);

    new_listing.owner = req.user._id;

    if (req.files && req.files.length > 0) {
        new_listing.image = req.files.map(file => ({
            url: file.path,        // Cloudinary URL
            filename: file.filename // public_id
        }));
    } else {
        // Optional default image
        new_listing.image = [{
            url: "https://i.pinimg.com/736x/ea/4c/da/ea4cdacc7cf0ac485a4a0589baf4df8b.jpg",
            filename: "default"
        }];
    }


  

    console.log(new_listing);
   
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

   
    

    // await Listing.findByIdAndUpdate(id,{title, image, description, price, location, country}, {new : true});
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