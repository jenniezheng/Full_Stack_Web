const body_parser=require("body-parser"),
mongoose=require("mongoose"),
express=require("express"),
express_sanitizer=require("express-sanitizer"),
method_override=require("method-override"),
app=express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.BLOG_DB_URL, {useMongoClient: true});

var rant_schema=mongoose.Schema({
	title:String,
	body:String,
	image:String,
	created:{type:Date, default: Date.now}
});

Rant=mongoose.model("rant",rant_schema);

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(method_override("_method"));
app.use(body_parser.urlencoded({extended:true}));
app.use(express_sanitizer());

app.get("/",function(req,res){
	res.render("landing");
});

app.get("/rants",function(req,res){
	Rant.find({},function(error,allRants){
		if(error)console.log("Error getting all rants!",error);
		else res.render("index",{rants:allRants});
	})
});


app.post("/rants",function(req,res){
	req.body.rant.body=req.sanitize(req.body.rant.body);
	Rant.create(req.body.rant, function(error, rant){
		if(error){
			console.log("Error creating rant!");
		}
		else res.redirect("/rants");
	});
});


app.get("/rants/new",function(req,res){
	res.render("new");
});

app.get("/rants/:id",function(req,res){
	Rant.findById(req.params.id, function(error, rant){
		if(error){
			console.log("Error finding rant by id!");
			res.render("destroy");
		}
		else{
			res.render("show", {rant:rant});
		}
	})
	
});

app.get("/rants/:id/edit",function(req,res){
	Rant.findById(req.params.id, function(error, rant){
		if(error)
			console.log("Error finding rant by id!");
		else
			res.render("edit", {rant:rant});
	});
});

app.put("/rants/:id",function(req,res){
	req.body.rant.body=req.sanitize(req.body.rant.body);
	Rant.findByIdAndUpdate(req.params.id, req.body.rant, function(error, rant){
		if(error){
			console.log("Error updating rant!");
		}
		else res.redirect("/rants/"+req.params.id);
	});
	
});

app.delete("/rants/:id",function(req,res){
	Rant.findById(req.params.id, function(error, rant){
		if(error)
			console.log("Error finding rant by id!");
		else
		{
			rant.remove(function(){
				res.redirect("/rants/:id");
			});
		}
	});
});



app.listen(process.env.PORT, process.env.IP,function(){
	console.log("Rant Server has started on port", process.env.PORT);
	console.log("If on localhost, view at http://localhost:"+process.env.PORT);
});