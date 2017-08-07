var middlewareObject={};

middlewareObject.isLoggedIn=function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that.");
    res.redirect("/login");
}

middlewareObject.hasCommentOwnership=function(req, res, next){
	if(!req.isAuthenticated()){
		req.flash("error","You need to be the owner of the comment to do that.");
		res.redirect("back");
	}
	else{
		Comment.findById(req.params.comment_id,function(error, comment){
			if(error){
				console.log("Error finding comment by ID!",error);
				req.flash("error","Comment not found.");
				res.redirect("back");
			}
			else if(!comment.author || !comment.author.id.equals(req.user._id)){
				console.log("No authorization to edit comment!");
				req.flash("error","You don't have permission edit that comment.");
				res.redirect("back");
			}
			else return next();
		}); 
	}
}

middlewareObject.hasAnimalOwnership=function(req, res, next){
	if(!req.isAuthenticated()){
		req.flash("error","You need to be the owner of the animal to do that.");
		res.redirect("back");
	}
	else{
		Animal.findById(req.params.id,function(error, animal){
			if(error){
				console.log("Error finding animal by ID!",error);
				req.flash("error","Animal not found.");
				res.redirect("back");
			}
			else if(!animal.author.id || !animal.author.id.equals(req.user._id)){
				req.flash("error","You don't have permission to edit that animal.");
				console.log("No authorization to edit animal!");
				res.redirect("back");
			}
			else return next();
		}); 
	}
}

module.exports=middlewareObject;