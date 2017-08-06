const express=require("express"),
	 mongoose=require("mongoose"),
	 body_parser=require("body-parser"),
	 app=express();

app.use(body_parser.urlencoded({ // to support URL-encoded bodies 
  extended: true
}));

app.set("view engine","ejs");

mongoose.connect("mongodb://localhost/animal_camp", {useMongoClient: true});
mongoose.Promise = global.Promise;

var animal_schema = new mongoose.Schema({ 
	name: String, 
	image: String, 
	description: String 
});

var Animal = mongoose.model("animal",animal_schema);





/*
animals=[
{
	name:"Coconut crab",
	image:"http://cdn1.arkive.org/media/3B/3B167445-FBDC-437E-B465-1226344D3B25/Presentation.Small/Coconut-crab-on-palm-trunk.jpg"
},
{
	name:"Polar Bear",
	image:"http://cdn1.arkive.org/media/5A/5A0EFDC6-48CB-4345-B45D-5D641AF35E1F/Presentation.Small/Male-polar-bear.jpg"
},
{
	name:"Humpback whale",
	image:"http://cdn1.arkive.org/media/65/65B3E57F-5861-4FBF-B36C-7D48DCDE98C4/Presentation.Small/Humpback-whale-breaching.jpg"
},
{
	name:"Emperor penguin",
	image:"http://cdn2.arkive.org/media/D0/D02DB7C5-7563-4CDE-B577-0372AF0269BB/Presentation.Small/Emperor-penguin-profile.jpg"
},
{
	name:"African elephant",
	image:"http://cdn2.arkive.org/media/CF/CFD70E26-A4EB-4095-81FD-EE8037F1CACF/Presentation.Small/African-elephant-family.jpg"
},
{
	name:"Whale shark",
	image:"http://cdn1.arkive.org/media/65/65663EE2-CD6A-409D-8382-55E7C574EFC4/Presentation.Small/Whale-shark-filter-feeding-surrounded-by-other-smaller-fish.jpg"
}
]


animals.forEach(function(animal){
	Animal.create(animal, function(error, animal){
	if(error){
		console.log("Error!");
	}
	else console.log("Captured ",animal);
	});
});
*/


app.get("/",function(req,res){
	res.render("landing");
});

app.get("/animals",function(req,res){
	Animal.find({},function(error,allAnimals){
		if(error)console.log("Error getting animals!",error);
		else{
			res.render("index",{animals:allAnimals});
		}
	})
});


app.post("/animals",function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.image;
	var animal={ name:name, image:image, description:description};
	Animal.create(animal, function(error, animal){
		if(error){
			console.log("Error creating animal!");
		}
		else res.redirect("/animals");
	});
});


app.get("/animals/new",function(req,res){
	res.render("create");
});

app.get("/animals/:id",function(req,res){
	Animal.findById(req.params.id, function(error, animal){
		if(error)
			console.log("Error finding animal by id!");
		else
			res.render("show", {animal:animal});
	})
	
});

app.listen(3002,function(){
	console.log("Animal Camp Server has started");
});