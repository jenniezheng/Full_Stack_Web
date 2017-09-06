const mongoose=require("mongoose");

var animal_schema = new mongoose.Schema({ 
	name: String, 
	image: String, 
	description: String,
	comments: [ {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }],
    author: {
		username: String,
		id: {
			type: mongoose.Schema.Types.ObjectId,
        	ref: "User"
		}
	}
});

module.exports = mongoose.model("Animal",animal_schema);


