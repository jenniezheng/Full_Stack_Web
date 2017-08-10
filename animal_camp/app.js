const express = require("express"),
mongoose = require("mongoose"),
body_parser = require("body-parser"),
flash = require("connect-flash"),
app = express(),
Comment = require("./models/comment"),
Animal = require("./models/animal"),
seedDB = require("./seeds");
User = require("./models/user"),
passport=require("passport"),
LocalStrategy = require("passport-local"),
method_override=require("method-override"),
passportLocalMongoose = require("passport-local-mongoose");
port_num=3000;


app.use(method_override("_method"));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"));
app.use(body_parser.urlencoded({extended: true}));
app.use(flash());
//==============
// Mongoose
//==============
mongoose.Promise = global.Promise;

//mongoose.connect("mongodb://localhost/animal_camp", {useMongoClient: true});
mongoose.connect("mongodb://jenniezheng321:123456AZ@ds129153.mlab.com:29153/malcamp", {useMongoClient: true});
var db = mongoose.connection;

//==============
// Passports
//==============
app.use(require("express-session")({
	secret: "Sausages taste amazing!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
	res.locals.user=req.user;
	res.locals.error_message=req.flash("error");
	res.locals.success_message=req.flash("success");
	next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//==============
// Routes
//==============
db.once('open', function callback () {
	const comment_routes=require("./routes/comments"),
	animal_routes=require("./routes/animals"),
	index_routes=require("./routes/index");
	app.use("/", index_routes);
	app.use("/animals",animal_routes);
	app.use("/animals/:id/comments",comment_routes);
	if(process.env.PORT)
	app.listen(process.env.PORT, process.env.IP,function(){
		console.log("Animal Camp Server has started");
	});
	else app.listen(port_num, process.env.IP,function(){
		console.log("Animal Camp Server has started on port ",port_num);
		console.log("View at http://localhost:"+port_num+"/");
	});
});