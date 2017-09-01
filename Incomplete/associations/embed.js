mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/testing")
var postSchema=mongoose.Schema({
	title:String,
	content:String
});

var userSchema=mongoose.Schema({
	name:String,
	email:String,
	//not Post but postSchema
	posts:[postSchema]
});

var Post=mongoose.model("Post",postSchema);
var User=mongoose.model("User",userSchema);

/*
var newUser=new User({
	email:"Georgie@gmail.com",
	name:"George"
})

newUser.posts.push({
	title:"How to kill cats",
	content:"Knife to the heart"
});

newUser.save(function(error, user){
	if(error)console.log("error");
	else console.log(user);
});
*/
User.findOne({name:"George"},function(error,user){
	if(error)console.log("error");
	else {
		console.log("HERE")
		user.posts.push({
			title:"3 things I love",
			content:"Not you"
		});
			
		user.save(function(error,user){
			console.log("HERE")
			if(!error)	console.log(user);
		});
		
	}
});