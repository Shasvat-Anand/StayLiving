const mongoose = require("mongoose");
const Data = require("./data.js");
 
const Listing = require("../models/Listing.js");

main().then(()=>{
    console.log("connection successful")
})
.catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Wonderlust")
}

const initdb = async ()=>{
    await Listing.deleteMany({});
    Data.Data = Data.Data.map((obj)=>({...obj, owner : "69a96e9649a040b3a8b78d22"}))
    await Listing.insertMany(Data.Data);
    console.log(Data);
}

initdb();
