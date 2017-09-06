<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Promisify setTimeout</title>
</head>
<body>
	<h1>Did the promise finish?</h1>
	<div class="completion">Not yet</div>
	<script>
		function wait(ms) {
			let myPromise= new Promise( function(resolve, reject) {
				//setTimeout(function () {
					console.log(this);
					resolve("Success!"); // Yay! Everything went well!
  				//}, ms);
			 });
			 return myPromise;
		};

		var milliseconds = 2000;
		wait(milliseconds).then(finish);


		function finish() {
			var completion = document.querySelector('.completion');
			completion.innerHTML = "Complete after " + milliseconds + "ms.";
		};
	</script>
</body>
</html>