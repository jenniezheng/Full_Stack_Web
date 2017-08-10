const express = require("express"),
router = express.Router({mergeParams: true});
Comment = require("../models/comment");
Animal = require("../models/animal");
middleware_obj=require("../middleware")

//NEW
router.get("/new",middleware_obj.isLoggedIn, function(req,res){
	Animal.findById(req.params.id, function(error, animal){
		if(error){
			console.log("Error finding animal by id!");
			res.redirect('/animals');
		}
		else{
			res.render("comments/new", {animal:animal});
		}
	});
});


//CREATE
router.post("/", middleware_obj.isLoggedIn, function(req,res){
	Animal.findById(req.params.id, function(error, animal){
		if(error){
			console.log("Error finding animal by id!");
			req.flash("error","Something went wrong.");
			res.redirect("back");
		}
		else{
			Comment.create(req.body.comment,function(err, comment){
				if(err){
					console.log(err);
				} else {
					comment.author={
						username:req.user.username,
						id:req.user._id
					};
					comment.save();
					animal.comments.push(comment);
					animal.save();
					req.flash("success","Your comment has been posted.");
					res.redirect('/animals/' + animal._id);
				}
			});
		}
	});
	
});


//UPDATE FORM
router.get("/:comment_id/edit",middleware_obj.hasCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id,function(error, comment){
		if(error){
			console.log("Error editing comment!");
			req.flash("error","Something went wrong.");
			res.redirect("back");
		}
		else Animal.findById(req.params.id, function(error, animal){
			if(error){
				console.log("Error finding animal by id!");
				req.flash("error","Something went wrong.");
				res.redirect("/animals/"+req.params.id );
			}
			else res.render("comments/edit", {animal:animal,comment:comment});
		})
	});
});

//UPDATE HANDLING
router.put("/:comment_id",middleware_obj.hasCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, { $set: { text: req.body.comment.text }},
	 function(error, comment){
		if(error){
			console.log("Error updating comment!",err);
			req.flash("error","Something went wrong.");
			res.redirect("back");
		}
		req.flash("success","Your comment has been edited.");
		res.redirect("/animals/"+req.params.id );
	});
	
});

//DELETE
router.delete("/:comment_id",middleware_obj.hasCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(error, comment){
		if(error){
			console.log("Error deleting comment!",err);
			req.flash("error","Something went wrong.");
			res.redirect("back");
		}
		res.redirect("/animals/"+req.params.id );
	});
});




module.exports=router;