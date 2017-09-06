const express = require("express"),
	 router = express.Router({mergeParams:true});
	 User = require("../models/user"),
	 passport=require("passport");

//ROOT
router.get("/",function(req,res){
	res.render("landing");
});


// Auth Routes
//REGISTER FORM
router.get("/register", function(req, res){
   res.render("register"); 
});

//HANDLE REGISTRATION
router.post("/register", function(req, res){
	var newUser=new User({username: req.body.username});
    User.register( newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Nice to meet you,",req.body.username+"!");
            res.redirect("/animals");
        });
    });
});

//LOGIN FORM
router.get("/login", function(req, res){
   res.render("login"); 
});

//HANDLE LOGIN
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login"
}) ,function(req, res){
    req.flash("success", "Welcome back,", req.body.username+".");
    res.redirect("/animals");
});

//LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are now logged out.");
    res.redirect("/animals");
});

module.exports=router;