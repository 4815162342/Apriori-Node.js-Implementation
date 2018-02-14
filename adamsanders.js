//THIS CODE IS MY OWN WORK, IT WAS WRITTEN WITHOUT CONSULTING A TUTOR OR CODE WRITTEN BY OTHER STUDENTS - Adam Sanders

var fs = require('fs');
var readline = require('readline');
var stream = require('stream');


if (process.argv.length < 5) {
	console.log("\nPlease input three parameters: 1) name of dataset, 2) threshold minimum, and 3) name of the output file\n\n");
	return;
}

var startTime = new Date();
var counts = {};
function processTransaction(item) {
	if (parseInt(item))
		counts[item] = counts[item]+1 || 1;
}

var readFd = fs.openSync(process.argv[2], 'r');
var writeFd = fs.openSync(process.argv[4], 'w');

var statResult = fs.fstatSync(readFd);

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

// Prune C1 for the minimum support
for (itemset in counts) {
	if (counts[itemset] < process.argv[3])
		delete counts[itemset];
}



// Write frequent itemsets to output file
var formattedString;
for (itemset in counts) {
	
	formattedString = itemset + ' (' + counts[itemset] + ')\n';
	fs.writeSync(writeFd, formattedString);
}

var endTime = new Date();
console.log('Apriori completed in', endTime - startTime, 'milliseconds');
fs.closeSync(readFd);
fs.closeSync(writeFd);