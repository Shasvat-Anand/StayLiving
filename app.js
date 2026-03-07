const express = require("express");
const app = express();

const ejsMate = require('ejs-mate')
app.set("view engine", "ejs");

 
const path = require("path");

app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.engine("ejs", ejsMate);

const methodOverride = require("method-override");
app.use(methodOverride("_method"))

app.use(express.static("public"));

app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require("mongoose");





//  flash 
const flash = require("connect-flash");



//  express session 

const session = require("express-session");

const sessionoptions = {
    secret : "brocode",
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires : Date.now() * 1000 * 24 * 60 * 60 * 7,
        maxAge : 1000 * 60 *60 *24 * 7,
        httpOnly : true
        
    }
}

app.use(session(sessionoptions));




//  to use passport we have to require it
const passport = require("passport")
//  to use local strategy and any kind of passport credential like facebook, twiiter, google
const localStrategy = require("passport-local");
// user schema
const User = require("./models/User")

//  to initialize the passport every time we the session is created
app.use(passport.initialize());
//  every time session know the user
app.use(passport.session());

//  use static authentication method of model in localstrategy
passport.use(new localStrategy(User.authenticate()))
app.use(flash())

//  use static serialize and deserialize model for passport session support
//  mean save the user and remove the user from the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    
    res.locals.currUser = req.user;
    next();
})


const listingRouter = require("./routes/listing")
const userRouter = require("./routes/user");
const reviewRouter = require("./routes/review")

app.use("/listing", listingRouter)
app.use("/listing/:id/review", reviewRouter)
app.use("/", userRouter)








 










main().then(()=>{
    console.log("connection successful")
})
.catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Wonderlust")
}

app.get("/", (req, res )=>{
    res.send("working");
})






 const ExpressError = require("./util/ExpressError");
const { sign } = require("crypto");


// handle General Error in from sever side.

// app.use((err, req, res ,next)=>{
//     res.send("Something went Wrong");
// })

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
 

//  handle expresserror class for mongosh error
app.use((err, req, res, next)=>{
    let{status = 500, message = "Something went wrong!"} = err;
    res.render("Error.ejs", {err});
    // res.status(status).send(message);
})




app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})