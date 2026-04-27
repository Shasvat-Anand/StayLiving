const mongoose = require("mongoose");
const {Schema} = mongoose;

const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true

    },
    description: {
        type: String,
    },
    image: [
        {
            url :{
                type:String,
                
            },
            filename:{
                type: String,
            },
        },
    ],
         
  
    singleprice: {
        type: Number,
        require: true
    },
    doubleprice: {
        type: Number,
        require: true
    },
    tripleprice: {
        type: Number,
        require: true
    },
    bedtype:{
        type: String,
        require : true
    }, 
    hosteltype:{
        type: String,
        require : true
    }, 
    roomtype:{
        type: String,
        require : true
    }, 
    bathroom:{
        type: String,
        require : true
    }, 
    contact:{
        type : String,
        require: true
    }, 
    alternatecontact:{
        type: String,
        require: true
    },
    location: {
        type: String
    },
    country: {
        type: String
    },

    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"  // name of the model which we want to refer to
        }
    ],
    owner :{
        type : Schema.Types.ObjectId,
        ref:"User"
    }


})

const Listing = new mongoose.model("Listing", ListingSchema);

module.exports = Listing;

