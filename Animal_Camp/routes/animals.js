const express = require("express"),
router = express.Router(),
Animal = require("../models/animal"),
Comment = require("../models/comment");
middleware_obj=require("../middleware/index")


//INDEX
router.get("/",function(req,res){
	Animal.find({},function(error,allAnimals){
		if(error){
			console.log("Error getting all animals!",error);
			req.flash("error","Something went wrong.");
			console.redirect("/");
		}
		else{
			res.render("animals/index",{animals:allAnimals});
		}
	})
});

//CREATE
router.post("/",middleware_obj.isLoggedIn, function(req,res){
	Animal.create(req.body.animal, function(error, animal){
		if(error) {
			req.flash("error","Something went wrong.");
			console.log("Error creating animal!", error);
		}
		else {
			animal.author={
				username:req.user.username,
				id:req.user._id
			};
			animal.save();
			
		}
		req.flash("success","You've captured a new animal!");
		res.redirect("/animals");
	});
});

//NEW
router.get("/new",middleware_obj.isLoggedIn, function(req,res){
	res.render("animals/new");
});

//SHOW
router.get("/:id",function(req,res){
	Animal.findById(req.params.id).populate("comments").exec(function(error, animal){
		if(error){
			console.log("Error showing animal!",error);
			res.redirect("/animals");
		}
		else{
			res.render("animals/show", {animal:animal});
		}
	});
});

//UPDATE FORM
router.get("/:id/edit",middleware_obj.hasAnimalOwnership, function(req,res){
	Animal.findById(req.params.id,function(error, animal){
		if(error){
			req.flash("error","Something went wrong.");
			console.log("Error editing animal!");
			res.redirect("/animals/"+req.params.id );
		}
		else res.render("animals/edit", {animal:animal});
	});
});

//UPDATE HANDLING
router.put("/:id",middleware_obj.hasAnimalOwnership,function(req,res){
	Animal.findByIdAndUpdate(req.params.id, req.body.animal, function(error, animal){
		if(error) {
			console.log("Error updating animal!",err);
			req.flash("error","Something went wrong.");
			res.redirect("/animals");
		}
		else {
			req.flash("success","You've updated your animal!");
			res.redirect("/animals/"+req.params.id );
		}
	});
	
});

//DELETE
router.delete("/:id",middleware_obj.hasAnimalOwnership,function(req,res){
	Animal.findByIdAndRemove(req.params.id, function(error, animal){
		if(error){
			req.flash("error","Something went wrong.");
			console.log("Error deleting animal!",err);
		}
		res.redirect("/animals");
	});
});



module.exports=router;