const mongoose=require("mongoose"),
	Animal=require("./models/animal");
	Comment=require("./models/comment");

mongoose.connect("mongodb://localhost/animal_camp", {useMongoClient: true});


animals=[
{
	name:"Coconut crab",
	image:"http://cdn1.arkive.org/media/3B/3B167445-FBDC-437E-B465-1226344D3B25/Presentation.Small/Coconut-crab-on-palm-trunk.jpg",
	
},
{
	name:"Polar Bear",
	image:"http://cdn1.arkive.org/media/5A/5A0EFDC6-48CB-4345-B45D-5D641AF35E1F/Presentation.Small/Male-polar-bear.jpg",

},
{
	name:"Humpback whale",
	image:"http://cdn1.arkive.org/media/65/65B3E57F-5861-4FBF-B36C-7D48DCDE98C4/Presentation.Small/Humpback-whale-breaching.jpg",

},
{
	name:"Emperor penguin",
	image:"http://cdn2.arkive.org/media/D0/D02DB7C5-7563-4CDE-B577-0372AF0269BB/Presentation.Small/Emperor-penguin-profile.jpg",

},
{
	name:"African elephant",
	image:"http://cdn2.arkive.org/media/CF/CFD70E26-A4EB-4095-81FD-EE8037F1CACF/Presentation.Small/African-elephant-family.jpg",
	
},
{
	name:"Whale shark",
	image:"http://cdn1.arkive.org/media/65/65663EE2-CD6A-409D-8382-55E7C574EFC4/Presentation.Small/Whale-shark-filter-feeding-surrounded-by-other-smaller-fish.jpg",
	
}
]


function seedDB(){
   //Remove all Animals
   Animal.find({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("ok!");

        /*
         //add a few Animals
        animals.forEach(function(seed){
            seed['description']="Lorem ipsum dolor sit amet, consectetur \
            adipiscing elit. Vestibulum convallis pellentesque risus molestie \
            cursus. In sollicitudin est metus, ac porttitor mi eleifend ac. Integer\
             vitae porta tortor. Aliquam maximus nisl vitae tortor sagittis, id placerat\
              odio eleifend. Praesent condimentum orci libero, ut lobortis lectus tempor\
               nec. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse \
               faucibus nec massa eget mollis. Praesent vitae lacinia massa. Donec sem ipsum, \
               rutrum eget pharetra vel, aliquam a mauris. Phasellus viverra ante vitae fringilla \
               ultrices. Duis ligula magna, venenatis et lectus ac, tempus lacinia dolor."
            Animal.create(seed, function(err, animal){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a animal");
                    //create a comment
                    Comment.create(
                        {
                            text: "What is this place?",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                animal.comments.push(comment);
                                animal.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
    */
})};




module.exports=seedDB;