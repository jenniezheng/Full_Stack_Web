heroku:
	-git add *
	-git commit -am "make commit"
	-git push heroku master

origin:
	-git add *
	-git commit -am "make commit"
	-git push origin master

prep:
	. ./export.sh