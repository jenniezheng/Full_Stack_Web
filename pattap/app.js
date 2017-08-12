const express = require("express"),
app = express();

app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/",function(req,res){
	res.render("pattap");
});


app.listen(process.env.PORT, process.env.IP,function(){
	console.log("Pattap has started on port", process.env.PORT);
	console.log("If on localhost, view at http://localhost:"+process.env.PORT);
});