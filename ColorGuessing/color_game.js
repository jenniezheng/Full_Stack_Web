colors = [
	"rgb(255, 0, 0)",
	"rgb(0, 255, 0)",
	"rgb(0, 0, 255)",
	"rgb(255, 255, 0)",
	"rgb(255, 0, 255)",
	"rgb(0, 255, 255)"
];
total_length=9;
easy_length=3;
current_length=9;
done=false;
pickedColor="";
message_display=document.getElementById("message_display");
color_display=document.getElementById("color_display");
squares=document.querySelectorAll("div.color button");
replayer=document.getElementById("replay");
easy=document.getElementById("easy");
hard=document.getElementById("hard");

init();

function init(){
	addListeners();
	reset();
}

function addListeners(){
	for (var i=0; i<squares.length; i++){
		squares[i].addEventListener("mouseover", function(){
			this.classList.add("hover");
		});
		squares[i].addEventListener("mouseout", function(){
			this.classList.remove("hover");
		});
		squares[i].addEventListener("click", function(){
			if(done)
				return;
			if(this.style.backgroundColor==pickedColor){
				for (var i=0; i<current_length; i++){
					squares[i].classList.remove("wrong");
					squares[i].classList.add("correct");
					squares[i].style.backgroundColor=pickedColor;
				}
				message_display.textContent="Good job.";
				replayer.textContent="Play Again";
				done=true;
				document.querySelector("div.top").style.backgroundColor=pickedColor;
			}
			else {
				this.classList.add("wrong");
				message_display.textContent="Nope.";
			}});
	}
	
	replayer.addEventListener("mouseover", function(){
		this.classList.add("hover");
	});
	replayer.addEventListener("mouseout", function(){
		this.classList.remove("hover");
	});
	hard.addEventListener("click", function(){
		hard.classList.add("toggled");
		easy.classList.remove("toggled");
		current_length=9;
		reset();
	});
	easy.addEventListener("click", function(){
		easy.classList.add("toggled");
		hard.classList.remove("toggled");
		current_length=3;
		reset();
	});
	replayer.addEventListener("click",reset);
}


function pickColor(){
	return Math.floor(Math.random()*255);
}

function reset(){
	for (var i=0; i<total_length; i++){
		squares[i].classList.remove("correct");
	}
	for (var i=0; i<easy_length; i++){
		squares[i].classList.remove("wrong");
	}
	for (var i=easy_length; i<total_length; i++){
		if(current_length==easy_length) squares[i].classList.add("wrong");
		else squares[i].classList.remove("wrong");
	}
	var picked_square=Math.floor(Math.random()*length);
	var p_red,p_green,p_blue;
	for (var i=0; i<current_length; i++){
		var red=pickColor(), green=pickColor(),blue=pickColor();
		squares[i].style.backgroundColor="rgb("+red+", "+green+", "+blue+")";
		if(picked_square==i){
			p_red=red; 
			p_green=green;
			p_blue=blue;
		}
	}
	pickedColor=squares[picked_square].style.backgroundColor;
	color_display.textContent="Red:"+p_red+", Green:"+p_blue+", Blue:"+p_blue;
	done=false;
	message_display.textContent="";
	replayer.textContent="Change Colors";
	document.querySelector("div.top").style.backgroundColor="black";
}