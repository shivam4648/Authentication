require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/registerDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, excludeFromEncryption: ['email']});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res)=>{
 res.render("home");
});

app.get("/register", (req, res)=>{
    res.render("register");
   });

   app.get("/login", (req, res)=>{
    res.render("login");
   });

app.post("/register", (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err)=>{
        if (!err) {
            res.redirect("/login");
        }
    });
});

app.post("/login", (req, res)=>{
    User.findOne({email: req.body.username}, (err, user)=>{
        if (!err) {
            if (user) {
                if (user.password === req.body.password) {
                    res.render("secrets");
                }else{
                    console.log("Incorrect password");
                }
            }
            else{
                console.log("User with this email id is note exit or register.");
            }
           
        }
    });
});

app.listen(3000, ()=>{
 console.log("server is running at port 3000...");
});