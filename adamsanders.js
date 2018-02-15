//THIS CODE IS MY OWN WORK, IT WAS WRITTEN WITHOUT CONSULTING A TUTOR OR CODE WRITTEN BY OTHER STUDENTS - Adam Sanders

var fs = require('fs');

if (process.argv.length < 5) {
	console.log("\nPlease input three parameters: 1) name of dataset, 2) threshold minimum, and 3) name of the output file\n\n");
	return;
}

// Helper functions
const processTransaction = item => {
	if (item)
		frequentItemset[item] = frequentItemset[item]+1 || 1;
}

const pruneItemset = () => {
	for (itemset in frequentItemset) {
		if (frequentItemset[itemset] < process.argv[3])
			delete frequentItemset[itemset];
	}
}

const startTime = new Date();
var frequentItemset = {};

const readFd = fs.openSync(process.argv[2], 'r');
const writeFd = fs.openSync(process.argv[4], 'w');

const statResult = fs.fstatSync(readFd);

var inputBuf = Buffer.alloc(statResult.size);
var bytesRead = fs.readSync(readFd, inputBuf, 0, inputBuf.length, 0);
var readChar = '', activeNum = '';


// Find frequent 1-itemsets, C1
for (i = 0; i < bytesRead; i++) {
	readChar = String.fromCharCode(inputBuf.readUInt8(i));
	
	if (readChar == ' ' || readChar == '\n') {
		processTransaction(activeNum);
		activeNum = '';
	}
	
	else
		activeNum += readChar;
}

pruneItemset();

while (true) {
	let frequentArray = Object.entries(frequentItemset);
	for (i = 0; i < frequentArray.length; i++) {
		for (j = i+1; j < frequentArray.length; j++) {
			processTransaction(`${frequentArray[i][0]} ${frequentArray[j][0]}`);
		}
	}
	
	//pruneItemset();
	break;
}


// Write frequent itemsets to output file
var formattedString;
for (itemset in frequentItemset) {
	
	formattedString = itemset + ' (' + frequentItemset[itemset] + ')\n';
	fs.writeSync(writeFd, formattedString);
}

var endTime = new Date();
console.log('Apriori completed in', endTime - startTime, 'milliseconds');
fs.closeSync(readFd);
fs.closeSync(writeFd);