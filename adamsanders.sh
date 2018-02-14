#THIS CODE IS MY OWN WORK, IT WAS WRITTEN WITHOUT CONSULTING A TUTOR OR CODE WRITTEN BY OTHER STUDENTS - Adam Sanders

if ! hash node 2>/dev/null; then
	printf "\nPlease install Node.js to execute my implementation of Apriori. Thanks."
	printf "\ndigitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04\n\n"
	exit 1;
fi

node adamsanders.js $1 $2 $3